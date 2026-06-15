import hashlib
import hmac
import time
import uuid
from decimal import Decimal
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APITestCase
from rest_framework import status
from api.models import User, Event, TicketTier, Ticket, EscrowAccount, AgentInvitation, Dispute

class EventVaultAPITests(APITestCase):
    def setUp(self):
        # Create users of different roles
        self.organizer = User.objects.create_user(
            username='organizer',
            email='organizer@example.com',
            password='Password123!',
            role=User.Role.ORGANIZER
        )
        self.customer1 = User.objects.create_user(
            username='customer1',
            email='customer1@example.com',
            password='Password123!',
            role=User.Role.CUSTOMER
        )
        self.customer2 = User.objects.create_user(
            username='customer2',
            email='customer2@example.com',
            password='Password123!',
            role=User.Role.CUSTOMER
        )
        self.agent = User.objects.create_user(
            username='agent',
            email='agent@example.com',
            password='Password123!',
            role=User.Role.AGENT
        )

        # Get JWT tokens
        self.organizer_token = self.get_jwt_token('organizer', 'Password123!')
        self.customer1_token = self.get_jwt_token('customer1', 'Password123!')
        self.customer2_token = self.get_jwt_token('customer2', 'Password123!')
        self.agent_token = self.get_jwt_token('agent', 'Password123!')

    def get_jwt_token(self, username, password):
        url = reverse('token_obtain_pair')
        response = self.client.post(url, {'username': username, 'password': password}, format='json')
        return response.data['access']

    def set_auth_header(self, token):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    def test_user_registration(self):
        # Reset auth credentials
        self.client.credentials()
        url = reverse('register-list')
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'NewPassword123!',
            'role': 'CUSTOMER',
            'phone_number': '+1234567890'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.filter(username='newuser').count(), 1)
        user = User.objects.get(username='newuser')
        self.assertEqual(user.role, User.Role.CUSTOMER)
        self.assertEqual(user.phone_number, '+1234567890')

    def test_event_and_tier_creation(self):
        self.set_auth_header(self.organizer_token)
        url = reverse('event-list')
        data = {
            'title': 'Rock Festival 2026',
            'description': 'An awesome rock festival.',
            'location': 'Wembley Stadium',
            'date': (timezone.now() + timezone.timedelta(days=30)).isoformat(),
            'status': 'PUBLISHED',
            'ticket_tiers': [
                {
                    'name': 'Standard',
                    'price': '50.00',
                    'quantity_total': 100,
                    'perks': 'General admission access'
                },
                {
                    'name': 'VIP',
                    'price': '150.00',
                    'quantity_total': 20,
                    'perks': 'Front row access, free drink'
                }
            ]
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verify event created
        event = Event.objects.get(title='Rock Festival 2026')
        self.assertEqual(event.organizer, self.organizer)
        self.assertEqual(event.status, Event.Status.PUBLISHED)
        
        # Verify tiers created
        self.assertEqual(event.ticket_tiers.count(), 2)
        standard_tier = event.ticket_tiers.get(name='Standard')
        self.assertEqual(standard_tier.price, Decimal('50.00'))
        self.assertEqual(standard_tier.quantity_total, 100)

        # Verify EscrowAccount auto-created
        self.assertTrue(EscrowAccount.objects.filter(event=event).exists())
        escrow = EscrowAccount.objects.get(event=event)
        self.assertEqual(escrow.locked_amount, Decimal('0.00'))
        self.assertEqual(escrow.status, EscrowAccount.Status.LOCKED)

    def test_ticket_purchase_and_escrow(self):
        # 1. Create event and tier first
        event = Event.objects.create(
            organizer=self.organizer,
            title='Tech Meetup',
            location='Virtual',
            date=timezone.now() + timezone.timedelta(days=10),
            status=Event.Status.PUBLISHED
        )
        tier = TicketTier.objects.create(
            event=event,
            name='Regular',
            price=Decimal('20.00'),
            quantity_total=50
        )
        EscrowAccount.objects.create(event=event, locked_amount=Decimal('0.00'), status=EscrowAccount.Status.LOCKED)

        # 2. Purchase ticket as customer 1
        self.set_auth_header(self.customer1_token)
        url = reverse('ticket-purchase')
        data = {
            'ticket_tier_id': tier.id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verify ticket details
        ticket = Ticket.objects.get(customer=self.customer1)
        self.assertEqual(ticket.ticket_tier, tier)
        self.assertEqual(ticket.status, Ticket.Status.ACTIVE)
        self.assertIsNotNone(ticket.secret_key)
        self.assertEqual(len(ticket.secret_key), 64) # Hex token length

        # Verify ticket tier sales updated
        tier.refresh_from_db()
        self.assertEqual(tier.quantity_sold, 1)

        # Verify escrow account updated
        escrow = EscrowAccount.objects.get(event=event)
        self.assertEqual(escrow.locked_amount, Decimal('20.00'))

    def test_agent_invitation_flow(self):
        event = Event.objects.create(
            organizer=self.organizer,
            title='Tech Meetup',
            location='Virtual',
            date=timezone.now() + timezone.timedelta(days=10),
            status=Event.Status.PUBLISHED
        )
        
        # 1. Organizer invites agent by email
        self.set_auth_header(self.organizer_token)
        url = reverse('event-invite-agent', kwargs={'pk': event.id})
        data = {'email': 'agent@example.com'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(AgentInvitation.objects.filter(event=event, email='agent@example.com').exists())

        # 2. Agent accepts invitation
        self.set_auth_header(self.agent_token)
        invite = AgentInvitation.objects.get(event=event, email='agent@example.com')
        url = reverse('invitation-accept-invitation', kwargs={'pk': invite.id})
        response = self.client.post(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        invite.refresh_from_db()
        self.assertTrue(invite.accepted)
        self.assertEqual(invite.accepted_by, self.agent)

    def test_dynamic_qr_code_verification(self):
        # Set up an event, ticket, and make sure agent is authorized to scan
        event = Event.objects.create(
            organizer=self.organizer,
            title='Jazz Night',
            location='Club Jazz',
            date=timezone.now() + timezone.timedelta(days=10),
            status=Event.Status.PUBLISHED
        )
        tier = TicketTier.objects.create(
            event=event,
            name='GA',
            price=Decimal('10.00'),
            quantity_total=10,
            quantity_sold=1
        )
        ticket = Ticket.objects.create(
            ticket_tier=tier,
            customer=self.customer1,
            status=Ticket.Status.ACTIVE
        )
        AgentInvitation.objects.create(
            event=event,
            email='agent@example.com',
            invited_by=self.organizer,
            accepted=True,
            accepted_by=self.agent
        )

        # 1. Generate the TOTP token for current time step
        current_time = int(time.time())
        time_step = current_time // 15
        
        # Compute SHA256(secret_key + time_step)
        message = f"{ticket.secret_key}{time_step}".encode('utf-8')
        valid_hash = hashlib.sha256(message).hexdigest()
        scanned_payload = f"{ticket.unique_id}:{valid_hash}"

        # 2. Verification as the agent (using the verify-ticket endpoint)
        self.set_auth_header(self.agent_token)
        url = reverse('agent-verify')
        data = {
            'scanned_payload': scanned_payload
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'VALID')

        # Verify ticket status in DB changed to SCANNED
        ticket.refresh_from_db()
        self.assertEqual(ticket.status, Ticket.Status.SCANNED)
        self.assertIsNotNone(ticket.scanned_at)
        self.assertEqual(ticket.scanned_by, self.agent)

        # 3. Test double spend prevention
        # Try to scan the same ticket again, should return INVALID/ALREADY_SCANNED
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('already been scanned', response.data['error'])

    def test_dynamic_qr_code_verification_time_drift(self):
        # Test that t-1 and t+1 are accepted, but t-2 is rejected
        event = Event.objects.create(
            organizer=self.organizer,
            title='Jazz Night',
            location='Club Jazz',
            date=timezone.now() + timezone.timedelta(days=10),
            status=Event.Status.PUBLISHED
        )
        tier = TicketTier.objects.create(
            event=event,
            name='GA',
            price=Decimal('10.00'),
            quantity_total=10,
            quantity_sold=1
        )
        ticket = Ticket.objects.create(
            ticket_tier=tier,
            customer=self.customer1,
            status=Ticket.Status.ACTIVE
        )
        AgentInvitation.objects.create(
            event=event,
            email='agent@example.com',
            invited_by=self.organizer,
            accepted=True,
            accepted_by=self.agent
        )

        current_time = int(time.time())
        time_step = current_time // 15

        self.set_auth_header(self.agent_token)
        url = reverse('agent-verify')

        # Test T-1 (drift backward)
        message_minus = f"{ticket.secret_key}{time_step - 1}".encode('utf-8')
        hash_minus = hashlib.sha256(message_minus).hexdigest()
        response = self.client.post(url, {'scanned_payload': f"{ticket.unique_id}:{hash_minus}"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Reset ticket status to Active to test T+1
        ticket.status = Ticket.Status.ACTIVE
        ticket.scanned_at = None
        ticket.scanned_by = None
        ticket.save()

        # Test T+1 (drift forward)
        message_plus = f"{ticket.secret_key}{time_step + 1}".encode('utf-8')
        hash_plus = hashlib.sha256(message_plus).hexdigest()
        response = self.client.post(url, {'scanned_payload': f"{ticket.unique_id}:{hash_plus}"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Reset ticket status to Active to test T-2 (outside drift window)
        ticket.status = Ticket.Status.ACTIVE
        ticket.scanned_at = None
        ticket.scanned_by = None
        ticket.save()

        # Test T-2 (expired)
        message_expired = f"{ticket.secret_key}{time_step - 2}".encode('utf-8')
        hash_expired = hashlib.sha256(message_expired).hexdigest()
        response = self.client.post(url, {'scanned_payload': f"{ticket.unique_id}:{hash_expired}"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Invalid verification code', response.data['error'])

    def test_escrow_release_conditions(self):
        # 1. Create an event that is completed
        event = Event.objects.create(
            organizer=self.organizer,
            title='Comedy Show',
            location='Theater',
            date=timezone.now() - timezone.timedelta(days=1), # in the past (completed)
            status=Event.Status.COMPLETED
        )
        escrow = EscrowAccount.objects.create(
            event=event,
            locked_amount=Decimal('100.00'),
            status=EscrowAccount.Status.LOCKED
        )
        tier = TicketTier.objects.create(
            event=event,
            name='Standard',
            price=Decimal('50.00'),
            quantity_total=10,
            quantity_sold=2 # 2 tickets sold
        )
        
        # Create 2 tickets
        ticket1 = Ticket.objects.create(ticket_tier=tier, customer=self.customer1, status=Ticket.Status.ACTIVE)
        ticket2 = Ticket.objects.create(ticket_tier=tier, customer=self.customer2, status=Ticket.Status.ACTIVE)
        
        # Case A: Try to release when scan count is 0% (less than 50%)
        self.set_auth_header(self.organizer_token)
        url = reverse('event-release-funds', kwargs={'pk': event.id})
        response = self.client.post(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Scan rate is too low', response.data['error'])
        
        # Case B: Scan 1 ticket (50% of the sold tickets)
        ticket1.status = Ticket.Status.SCANNED
        ticket1.scanned_at = timezone.now()
        ticket1.scanned_by = self.agent
        ticket1.save()
        
        # Try to release: Should succeed now since 50% scanned and no disputes
        response = self.client.post(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        escrow.refresh_from_db()
        self.assertEqual(escrow.status, EscrowAccount.Status.RELEASED)
        event.refresh_from_db()
        self.assertEqual(event.status, Event.Status.VALIDATED)

    def test_escrow_release_blocked_by_dispute(self):
        event = Event.objects.create(
            organizer=self.organizer,
            title='Comedy Show 2',
            location='Theater',
            date=timezone.now() - timezone.timedelta(days=1),
            status=Event.Status.COMPLETED
        )
        escrow = EscrowAccount.objects.create(
            event=event,
            locked_amount=Decimal('50.00'),
            status=EscrowAccount.Status.LOCKED
        )
        tier = TicketTier.objects.create(
            event=event,
            name='Standard',
            price=Decimal('50.00'),
            quantity_total=10,
            quantity_sold=1
        )
        ticket = Ticket.objects.create(ticket_tier=tier, customer=self.customer1, status=Ticket.Status.SCANNED, scanned_at=timezone.now(), scanned_by=self.agent)
        
        # Create a dispute on the event
        Dispute.objects.create(event=event, customer=self.customer1, reason="The event was canceled early")
        
        # Try to release: Should fail due to active dispute
        self.set_auth_header(self.organizer_token)
        url = reverse('event-release-funds', kwargs={'pk': event.id})
        response = self.client.post(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Active disputes exist', response.data['error'])
