from django.conf import settings
from django.db import models


class Profile(models.Model):
	user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
	full_name = models.CharField(max_length=255)
	phone = models.CharField(max_length=30, blank=True, default='')
	avatar_url = models.URLField(blank=True, default='')

	def __str__(self) -> str:
		return self.full_name or self.user.email


class AuthToken(models.Model):
	user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='auth_token')
	access_token = models.CharField(max_length=255, unique=True)
	refresh_token = models.CharField(max_length=255, unique=True)
	created_at = models.DateTimeField(auto_now_add=True)
	last_used_at = models.DateTimeField(auto_now=True)

	def touch(self) -> None:
		self.save(update_fields=['last_used_at'])


class Booking(models.Model):
	STATUS_PENDING = 'pending'
	STATUS_CONFIRMED = 'confirmed'
	STATUS_CANCELLED = 'cancelled'
	STATUS_COMPLETED = 'completed'

	STATUS_CHOICES = [
		(STATUS_PENDING, 'Pending'),
		(STATUS_CONFIRMED, 'Confirmed'),
		(STATUS_CANCELLED, 'Cancelled'),
		(STATUS_COMPLETED, 'Completed'),
	]

	user = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		null=True,
		blank=True,
		on_delete=models.SET_NULL,
		related_name='bookings',
	)
	booking_id = models.CharField(max_length=32, unique=True)
	hotel_id = models.PositiveIntegerField()
	hotel_name = models.CharField(max_length=255)
	hotel_thumbnail = models.URLField(blank=True, default='')
	check_in = models.CharField(max_length=10)
	check_out = models.CharField(max_length=10)
	guests = models.JSONField(default=dict)
	customer = models.JSONField(default=dict)
	payment = models.JSONField(default=dict)
	status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
	currency = models.CharField(max_length=8, default='VND')
	total = models.BigIntegerField(default=0)
	price = models.JSONField(default=dict)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def to_summary(self) -> dict:
		return {
			'id': self.id,
			'booking_id': self.booking_id,
			'hotel_id': self.hotel_id,
			'hotel_name': self.hotel_name,
			'hotel_thumbnail': self.hotel_thumbnail or None,
			'check_in': self.check_in,
			'check_out': self.check_out,
			'guests': self.guests,
			'status': self.status,
			'total': self.total,
			'currency': self.currency,
			'created_at': self.created_at.isoformat(),
		}
