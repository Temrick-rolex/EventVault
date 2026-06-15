from rest_framework import serializers
from api.models import User, Event, TicketTier, Ticket, EscrowAccount, AgentInvitation, Dispute
from django.db import transaction

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role', 'phone_number']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            role=validated_data.get('role', User.Role.CUSTOMER),
            phone_number=validated_data.get('phone_number', '')
        )
        return user


class TicketTierSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketTier
        fields = ['id', 'name', 'price', 'quantity_total', 'quantity_sold', 'perks']
        read_only_fields = ['quantity_sold']


class EventSerializer(serializers.ModelSerializer):
    ticket_tiers = TicketTierSerializer(many=True, required=False)
    organizer_name = serializers.ReadOnlyField(source='organizer.username')

    class Meta:
        model = Event
        fields = [
            'id', 'organizer', 'organizer_name', 'title', 'description', 
            'location', 'date', 'status', 'artwork', 'artwork_prompt', 
            'qr_zone_coordinates', 'ticket_tiers', 'created_at', 'updated_at'
        ]
        read_only_fields = ['organizer', 'created_at', 'updated_at']

    def create(self, validated_data):
        ticket_tiers_data = validated_data.pop('ticket_tiers', [])
        
        # Run everything in a transaction for safety
        with transaction.atomic():
            event = Event.objects.create(**validated_data)
            # Auto-create EscrowAccount for the event
            EscrowAccount.objects.create(event=event)
            
            for tier_data in ticket_tiers_data:
                TicketTier.objects.create(event=event, **tier_data)
                
        return event


class TicketSerializer(serializers.ModelSerializer):
    ticket_tier_name = serializers.ReadOnlyField(source='ticket_tier.name')
    ticket_tier_price = serializers.ReadOnlyField(source='ticket_tier.price')
    event_title = serializers.ReadOnlyField(source='ticket_tier.event.title')
    event_date = serializers.ReadOnlyField(source='ticket_tier.event.date')
    event_location = serializers.ReadOnlyField(source='ticket_tier.event.location')
    customer_username = serializers.ReadOnlyField(source='customer.username')

    class Meta:
        model = Ticket
        fields = [
            'id', 'unique_id', 'ticket_tier', 'ticket_tier_name', 'ticket_tier_price',
            'event_title', 'event_date', 'event_location', 'customer', 
            'customer_username', 'status', 'purchased_at', 'scanned_at', 'scanned_by'
        ]
        read_only_fields = [
            'unique_id', 'customer', 'status', 'purchased_at', 'scanned_at', 'scanned_by'
        ]


class AgentInvitationSerializer(serializers.ModelSerializer):
    event_title = serializers.ReadOnlyField(source='event.title')
    invited_by_username = serializers.ReadOnlyField(source='invited_by.username')
    accepted_by_username = serializers.ReadOnlyField(source='accepted_by.username')

    class Meta:
        model = AgentInvitation
        fields = [
            'id', 'event', 'event_title', 'email', 'invited_by', 
            'invited_by_username', 'accepted', 'accepted_by', 
            'accepted_by_username', 'created_at'
        ]
        read_only_fields = ['invited_by', 'accepted', 'accepted_by', 'created_at']


class DisputeSerializer(serializers.ModelSerializer):
    event_title = serializers.ReadOnlyField(source='event.title')
    customer_username = serializers.ReadOnlyField(source='customer.username')

    class Meta:
        model = Dispute
        fields = [
            'id', 'event', 'event_title', 'customer', 'customer_username',
            'reason', 'status', 'created_at', 'resolved_at'
        ]
        read_only_fields = ['customer', 'status', 'created_at', 'resolved_at']
