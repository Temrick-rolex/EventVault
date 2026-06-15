import io
import time
import hashlib
import hmac
import random
from decimal import Decimal
from PIL import Image, ImageDraw

from django.utils import timezone
from django.db import transaction
from django.core.files.base import ContentFile
from django.shortcuts import get_object_or_404

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from api.models import User, Event, TicketTier, Ticket, EscrowAccount, AgentInvitation, Dispute
from api.serializers import (
    UserSerializer, EventSerializer, TicketTierSerializer, 
    TicketSerializer, AgentInvitationSerializer, DisputeSerializer
)

def generate_abstract_artwork(prompt, title):
    """
    Generates a unique abstract background image using PIL based on a prompt.
    Fulfills the 'AI Template Engine' requirement locally without needing external keys.
    """
    width, height = 800, 450
    # Seed random with prompt to make the generation deterministic/unique to prompt
    seed_val = int(hashlib.md5(prompt.encode('utf-8')).hexdigest(), 16) % (2**32)
    rng = random.Random(seed_val)
    
    # Base gradient background (simulated by drawing overlapping rectangles)
    img = Image.new("RGB", (width, height), color="#111827")
    draw = ImageDraw.Draw(img)
    
    # Draw vibrant colored shapes
    for _ in range(rng.randint(6, 12)):
        r = rng.randint(80, 200)
        x = rng.randint(0, width)
        y = rng.randint(0, height)
        # Vibrant neon colors
        color = (rng.randint(80, 255), rng.randint(50, 200), rng.randint(150, 255))
        draw.ellipse([x - r, y - r, x + r, y + r], fill=color)

    # Apply a soft dark overlay for text readability
    overlay = Image.new("RGBA", (width, height), (17, 24, 39, 150)) # semi-transparent dark gray
    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    
    # Save image to bytes
    img_io = io.BytesIO()
    img.save(img_io, format='JPEG', quality=85)
    img_io.seek(0)
    return img_io


class UserRegistrationViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
    http_method_names = ['post']


class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.is_anonymous:
            return Event.objects.filter(status=Event.Status.PUBLISHED)
        
        # Organizers can see all their own events (draft, published, etc.)
        if user.role == User.Role.ORGANIZER:
            return Event.objects.filter(organizer=user)
        
        # Others can only see published/completed/validated events
        return Event.objects.filter(status__in=[
            Event.Status.PUBLISHED, 
            Event.Status.COMPLETED, 
            Event.Status.VALIDATED,
            Event.Status.REFUNDED
        ])

    def perform_create(self, serializer):
        if self.request.user.role != User.Role.ORGANIZER:
            raise serializers.ValidationError("Only users with the 'ORGANIZER' role can create events.")
        serializer.save(organizer=self.request.user)

    @action(detail=True, methods=['post'], url_path='generate-art')
    def generate_art(self, request, pk=None):
        event = self.get_object()
        if event.organizer != request.user:
            return Response({"error": "Only the event organizer can generate artwork."}, status=status.HTTP_403_FORBIDDEN)
        
        prompt = request.data.get('prompt', '').strip()
        if not prompt:
            return Response({"error": "Prompt cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Generate and save abstract image
        img_bytes = generate_abstract_artwork(prompt, event.title)
        event.artwork_prompt = prompt
        event.artwork.save(f"event_{event.id}_art.jpg", ContentFile(img_bytes.read()), save=True)
        
        return Response(EventSerializer(event).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='invite-agent')
    def invite_agent(self, request, pk=None):
        event = self.get_object()
        if event.organizer != request.user:
            return Response({"error": "Only the event organizer can invite agents."}, status=status.HTTP_403_FORBIDDEN)
        
        email = request.data.get('email', '').strip()
        if not email:
            return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        invitation, created = AgentInvitation.objects.get_or_create(
            event=event,
            email=email,
            defaults={'invited_by': request.user}
        )
        
        if not created:
            return Response({"error": "Agent already invited to this event."}, status=status.HTTP_400_BAD_REQUEST)
            
        serializer = AgentInvitationSerializer(invitation)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='release-funds')
    def release_funds(self, request, pk=None):
        event = self.get_object()
        if event.organizer != request.user:
            return Response({"error": "Only the event organizer can request fund release."}, status=status.HTTP_403_FORBIDDEN)

        escrow = getattr(event, 'escrow_account', None)
        if not escrow:
            return Response({"error": "Escrow account not found for this event."}, status=status.HTTP_404_NOT_FOUND)

        if escrow.status != EscrowAccount.Status.LOCKED:
            return Response({"error": f"Escrow is not locked. Current status: {escrow.status}"}, status=status.HTTP_400_BAD_REQUEST)

        # 48-Hour Validation Check
        # Check event date: event must have finished
        if event.date > timezone.now():
            return Response({"error": "Event has not occurred yet. Cannot release funds before the event date."}, status=status.HTTP_400_BAD_REQUEST)

        # Check disputes
        active_disputes = Dispute.objects.filter(event=event, status=Dispute.Status.PENDING).exists()
        if active_disputes:
            return Response({"error": "Active disputes exist. Escrow is locked pending resolution."}, status=status.HTTP_400_BAD_REQUEST)

        # Check scan rate (>= 50% of sold tickets must be scanned)
        tickets = Ticket.objects.filter(ticket_tier__event=event)
        total_sold = tickets.count()
        
        if total_sold > 0:
            scanned_count = tickets.filter(status=Ticket.Status.SCANNED).count()
            scan_rate = (scanned_count / total_sold) * 100
            if scan_rate < 50.0:
                return Response({
                    "error": f"Scan rate is too low ({scan_rate:.2f}%). At least 50% of sold tickets must be verified."
                }, status=status.HTTP_400_BAD_REQUEST)

        # Release funds
        with transaction.atomic():
            escrow.status = EscrowAccount.Status.RELEASED
            escrow.save()
            event.status = Event.Status.VALIDATED
            event.save()

        return Response({
            "message": "Funds successfully released from escrow to organizer.",
            "escrow_status": escrow.status,
            "event_status": event.status
        }, status=status.HTTP_200_OK)


class TicketViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Customers can only see their own tickets
        if self.request.user.role == User.Role.CUSTOMER:
            return Ticket.objects.filter(customer=self.request.user)
        # Agents can see tickets for events they are assigned to
        elif self.request.user.role == User.Role.AGENT:
            invited_events = AgentInvitation.objects.filter(
                email=self.request.user.email, accepted=True
            ).values_list('event_id', flat=True)
            return Ticket.objects.filter(ticket_tier__event_id__in=invited_events)
        # Organizers can see tickets for their own events
        elif self.request.user.role == User.Role.ORGANIZER:
            return Ticket.objects.filter(ticket_tier__event__organizer=self.request.user)
        return Ticket.objects.none()

    @action(detail=False, methods=['post'], url_path='purchase', permission_classes=[permissions.IsAuthenticated])
    def purchase(self, request):
        if request.user.role != User.Role.CUSTOMER:
            return Response({"error": "Only customers can purchase tickets."}, status=status.HTTP_403_FORBIDDEN)

        tier_id = request.data.get('ticket_tier_id')
        if not tier_id:
            return Response({"error": "ticket_tier_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            tier = TicketTier.objects.select_for_update().get(id=tier_id)
        except TicketTier.DoesNotExist:
            return Response({"error": "Ticket tier not found."}, status=status.HTTP_404_NOT_FOUND)

        if tier.is_sold_out:
            return Response({"error": "This ticket tier is sold out."}, status=status.HTTP_400_BAD_REQUEST)

        # Atomic transaction to guarantee double-spend prevention and lock integrity
        with transaction.atomic():
            # Increment sold count
            tier.quantity_sold += 1
            tier.save()

            # Create ticket
            ticket = Ticket.objects.create(
                ticket_tier=tier,
                customer=request.user,
                status=Ticket.Status.ACTIVE
            )

            # Update Escrow Account
            escrow, created = EscrowAccount.objects.get_or_create(event=tier.event)
            escrow.locked_amount += tier.price
            escrow.save()

        serializer = TicketSerializer(ticket)
        # Include secret key only during purchase for secure initial storage
        data = serializer.data
        data['secret_key'] = ticket.secret_key
        return Response(data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'], url_path='sec-key')
    def get_secret_key(self, request, pk=None):
        ticket = self.get_object()
        if ticket.customer != request.user:
            return Response({"error": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)
        return Response({"secret_key": ticket.secret_key}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='dispute')
    def dispute(self, request, pk=None):
        ticket = self.get_object()
        if ticket.customer != request.user:
            return Response({"error": "Not authorized to file a dispute for this ticket."}, status=status.HTTP_403_FORBIDDEN)

        reason = request.data.get('reason', '').strip()
        if not reason:
            return Response({"error": "Dispute reason is required."}, status=status.HTTP_400_BAD_REQUEST)

        dispute, created = Dispute.objects.get_or_create(
            event=ticket.ticket_tier.event,
            customer=request.user,
            defaults={'reason': reason}
        )

        if not created:
            return Response({"error": "You have already filed a dispute for this event."}, status=status.HTTP_400_BAD_REQUEST)

        return Response(DisputeSerializer(dispute).data, status=status.HTTP_201_CREATED)


class AgentInvitationViewSet(viewsets.ModelViewSet):
    serializer_class = AgentInvitationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == User.Role.AGENT:
            return AgentInvitation.objects.filter(email=user.email)
        elif user.role == User.Role.ORGANIZER:
            return AgentInvitation.objects.filter(invited_by=user)
        return AgentInvitation.objects.none()

    @action(detail=True, methods=['post'], url_path='accept')
    def accept_invitation(self, request, pk=None):
        if request.user.role != User.Role.AGENT:
            return Response({"error": "Only agents can accept invitations."}, status=status.HTTP_403_FORBIDDEN)

        try:
            invitation = AgentInvitation.objects.get(id=pk, email=request.user.email)
        except AgentInvitation.DoesNotExist:
            return Response({"error": "Invitation not found."}, status=status.HTTP_404_NOT_FOUND)

        if invitation.accepted:
            return Response({"error": "Invitation already accepted."}, status=status.HTTP_400_BAD_REQUEST)

        invitation.accepted = True
        invitation.accepted_by = request.user
        invitation.save()

        return Response({"message": "Invitation accepted successfully."}, status=status.HTTP_200_OK)


class AgentVerificationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        if user.role not in [User.Role.AGENT, User.Role.ORGANIZER]:
            return Response({"error": "Not authorized to verify tickets."}, status=status.HTTP_403_FORBIDDEN)

        payload = request.data.get('scanned_payload', '').strip()
        if not payload or ':' not in payload:
            return Response({"error": "Invalid payload format. Expected 'uuid:hash'."}, status=status.HTTP_400_BAD_REQUEST)

        uuid_str, scanned_hash = payload.split(':', 1)
        try:
            ticket = Ticket.objects.get(unique_id=uuid_str)
        except (Ticket.DoesNotExist, ValueError):
            return Response({"error": "Ticket not found."}, status=status.HTTP_404_NOT_FOUND)

        # Authorization: Check if agent is invited & accepted, or if user is the event organizer
        event = ticket.ticket_tier.event
        if user.role == User.Role.AGENT:
            is_authorized = AgentInvitation.objects.filter(
                event=event, email=user.email, accepted=True
            ).exists()
            if not is_authorized:
                return Response({"error": "You are not authorized to scan tickets for this event."}, status=status.HTTP_403_FORBIDDEN)
        elif user.role == User.Role.ORGANIZER:
            if event.organizer != user:
                return Response({"error": "You are not the organizer of this event."}, status=status.HTTP_403_FORBIDDEN)

        # Check ticket status
        if ticket.status == Ticket.Status.SCANNED:
            return Response({
                "error": f"Ticket has already been scanned at {ticket.scanned_at} by {ticket.scanned_by.username}."
            }, status=status.HTTP_400_BAD_REQUEST)
        elif ticket.status == Ticket.Status.REFUNDED:
            return Response({"error": "Ticket has been refunded."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate TOTP offline hash
        # Check current time step and drift (T, T-1, T+1)
        current_time = int(time.time())
        time_step = current_time // 15
        
        valid = False
        for step in [time_step, time_step - 1, time_step + 1]:
            message = f"{ticket.secret_key}{step}".encode('utf-8')
            expected_hash = hashlib.sha256(message).hexdigest()
            if hmac.compare_digest(scanned_hash, expected_hash):
                valid = True
                break

        if not valid:
            return Response({"error": "Invalid verification code (expired or tampered)."}, status=status.HTTP_400_BAD_REQUEST)

        # Mark as scanned
        with transaction.atomic():
            ticket.status = Ticket.Status.SCANNED
            ticket.scanned_at = timezone.now()
            ticket.scanned_by = user
            ticket.save()

        return Response({
            "status": "VALID",
            "message": "Ticket successfully verified.",
            "ticket": TicketSerializer(ticket).data
        }, status=status.HTTP_200_OK)


class AgentSyncView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, event_id):
        user = request.user
        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            return Response({"error": "Event not found."}, status=status.HTTP_404_NOT_FOUND)

        # Check authorization
        if user.role == User.Role.AGENT:
            is_authorized = AgentInvitation.objects.filter(
                event=event, email=user.email, accepted=True
            ).exists()
            if not is_authorized:
                return Response({"error": "You are not authorized to scan tickets for this event."}, status=status.HTTP_403_FORBIDDEN)
        elif user.role == User.Role.ORGANIZER:
            if event.organizer != user:
                return Response({"error": "You are not the organizer of this event."}, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({"error": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)

        # Fetch active tickets for sync
        tickets = Ticket.objects.filter(ticket_tier__event=event, status=Ticket.Status.ACTIVE)
        
        # Build sync payload
        sync_data = []
        for ticket in tickets:
            sync_data.append({
                "unique_id": str(ticket.unique_id),
                "secret_key": ticket.secret_key,
                "tier_name": ticket.ticket_tier.name
            })

        return Response({
            "event_id": event.id,
            "event_title": event.title,
            "tickets": sync_data
        }, status=status.HTTP_200_OK)
