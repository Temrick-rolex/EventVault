import uuid
import secrets
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator
from django.db.models import CheckConstraint, Q

class User(AbstractUser):
    class Role(models.TextChoices):
        ORGANIZER = 'ORGANIZER', 'Organizer'
        CUSTOMER = 'CUSTOMER', 'Customer'
        AGENT = 'AGENT', 'Agent'
        
    role = models.CharField(
        max_length=15,
        choices=Role.choices,
        default=Role.CUSTOMER,
        db_index=True
    )
    phone_number = models.CharField(max_length=20, blank=True, null=True, unique=True)

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"


class Event(models.Model):
    class Status(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft'
        PUBLISHED = 'PUBLISHED', 'Published'
        CANCELLED = 'CANCELLED', 'Cancelled'
        COMPLETED = 'COMPLETED', 'Completed' # Event has happened
        VALIDATED = 'VALIDATED', 'Validated & Settled' # Escrow released
        REFUNDED = 'REFUNDED', 'Refunded' # Escrow returned to buyers
        
    organizer = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='organized_events',
        limit_choices_to={'role': User.Role.ORGANIZER}
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=255)
    date = models.DateTimeField(db_index=True)
    status = models.CharField(
        max_length=15,
        choices=Status.choices,
        default=Status.DRAFT,
        db_index=True
    )
    
    # AI generated or custom artwork path
    artwork = models.ImageField(upload_to='artworks/', blank=True, null=True)
    artwork_prompt = models.TextField(blank=True, help_text="AI prompt used to generate the background art")
    qr_zone_coordinates = models.JSONField(blank=True, null=True, help_text="Coordinates for overlaying QR code on artwork")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']
        indexes = [
            models.Index(fields=['status', 'date']),
        ]

    def __str__(self):
        return self.title


class TicketTier(models.Model):
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name='ticket_tiers'
    )
    name = models.CharField(max_length=100) # Standard, VIP, VVIP, etc.
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0.00)]
    )
    quantity_total = models.PositiveIntegerField()
    quantity_sold = models.PositiveIntegerField(default=0)
    perks = models.TextField(blank=True, help_text="Comma separated or bullet points of perks included")
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('event', 'name')
        constraints = [
            CheckConstraint(
                condition=Q(price__gte=0.00),
                name='ticket_tier_price_non_negative'
            ),
            CheckConstraint(
                condition=Q(quantity_sold__lte=models.F('quantity_total')),
                name='ticket_tier_quantity_sold_within_limit'
            )
        ]

    def __str__(self):
        return f"{self.name} - {self.event.title} (${self.price})"

    @property
    def is_sold_out(self):
        return self.quantity_sold >= self.quantity_total


class Ticket(models.Model):
    class Status(models.TextChoices):
        ACTIVE = 'ACTIVE', 'Active'
        SCANNED = 'SCANNED', 'Scanned'
        REFUNDED = 'REFUNDED', 'Refunded'

    ticket_tier = models.ForeignKey(
        TicketTier,
        on_delete=models.PROTECT,
        related_name='tickets'
    )
    customer = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='purchased_tickets',
        limit_choices_to={'role': User.Role.CUSTOMER}
    )
    unique_id = models.UUIDField(default=uuid.uuid4, unique=True, db_index=True)
    secret_key = models.CharField(
        max_length=64,
        unique=True,
        default=secrets.token_hex
    )
    status = models.CharField(
        max_length=15,
        choices=Status.choices,
        default=Status.ACTIVE,
        db_index=True
    )
    purchased_at = models.DateTimeField(auto_now_add=True)
    
    # Verification details
    scanned_at = models.DateTimeField(null=True, blank=True, db_index=True)
    scanned_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='verified_tickets',
        limit_choices_to={'role': User.Role.AGENT}
    )

    class Meta:
        ordering = ['-purchased_at']
        indexes = [
            models.Index(fields=['unique_id', 'status']),
        ]

    def __str__(self):
        return f"Ticket {self.unique_id} ({self.ticket_tier.name})"


class EscrowAccount(models.Model):
    class Status(models.TextChoices):
        LOCKED = 'LOCKED', 'Locked'
        RELEASED = 'RELEASED', 'Released to Organizer'
        REFUNDED = 'REFUNDED', 'Refunded to Customers'

    event = models.OneToOneField(
        Event,
        on_delete=models.PROTECT,
        related_name='escrow_account'
    )
    locked_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(0.00)]
    )
    status = models.CharField(
        max_length=15,
        choices=Status.choices,
        default=Status.LOCKED,
        db_index=True
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            CheckConstraint(
                condition=Q(locked_amount__gte=0.00),
                name='escrow_locked_amount_non_negative'
            )
        ]

    def __str__(self):
        return f"Escrow for {self.event.title} (${self.locked_amount} - {self.get_status_display()})"


class AgentInvitation(models.Model):
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name='agent_invitations'
    )
    email = models.EmailField(db_index=True)
    invited_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='sent_agent_invitations',
        limit_choices_to={'role': User.Role.ORGANIZER}
    )
    accepted = models.BooleanField(default=False)
    accepted_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='accepted_invitations',
        limit_choices_to={'role': User.Role.AGENT}
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('event', 'email')

    def __str__(self):
        status = "Accepted" if self.accepted else "Pending"
        return f"Invite for {self.email} to {self.event.title} ({status})"


class Dispute(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        RESOLVED = 'RESOLVED', 'Resolved'

    event = models.ForeignKey(
        Event,
        on_delete=models.PROTECT,
        related_name='disputes'
    )
    customer = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='filed_disputes',
        limit_choices_to={'role': User.Role.CUSTOMER}
    )
    reason = models.TextField(help_text="Reason for filing the dispute (e.g. event cancellation, fraud)")
    status = models.CharField(
        max_length=15,
        choices=Status.choices,
        default=Status.PENDING,
        db_index=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('event', 'customer')

    def __str__(self):
        return f"Dispute by {self.customer.username} on {self.event.title} ({self.get_status_display()})"
