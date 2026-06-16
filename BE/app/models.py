from django.conf import settings
from django.db import models


class Profile(models.Model):
	ROLE_CUSTOMER = 'customer'
	ROLE_VENDOR = 'vendor'
	ROLE_ADMIN = 'admin'
	ROLE_CHOICES = [
		(ROLE_CUSTOMER, 'Customer'),
		(ROLE_VENDOR, 'Vendor'),
		(ROLE_ADMIN, 'Admin'),
	]

	user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
	full_name = models.CharField(max_length=255)
	phone = models.CharField(max_length=30, blank=True, default='')
	avatar_url = models.URLField(blank=True, default='')
	role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_CUSTOMER)

	def __str__(self) -> str:
		return self.full_name or self.user.email


class Hotel(models.Model):
	owner = models.OneToOneField(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name='owned_hotel',
		null=True,
		blank=True
	)
	name = models.CharField(max_length=255)
	province = models.CharField(max_length=255, default='')
	address = models.CharField(max_length=255)
	price_per_night = models.PositiveIntegerField(default=0)
	rating = models.FloatField(default=0.0)
	reviews_count = models.PositiveIntegerField(default=0)
	amenities = models.JSONField(default=list)
	thumbnail = models.URLField(blank=True, default='')
	description = models.TextField(blank=True, default='')
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self) -> str:
		return self.name

class RoomType(models.Model):
	hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name='room_types')
	name = models.CharField(max_length=255)
	price = models.PositiveIntegerField(default=0)
	capacity = models.PositiveIntegerField(default=2)
	available_rooms = models.PositiveIntegerField(default=1)
	features = models.JSONField(default=list)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self) -> str:
		return f"{self.hotel.name} - {self.name}"

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
	hotel = models.ForeignKey(
		'Hotel',
		on_delete=models.SET_NULL,
		null=True,
		blank=True,
		related_name='bookings'
	)
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
