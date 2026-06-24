from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from uuid import uuid4

from django.db import transaction

from django.utils.timezone import now
from datetime import timedelta
from app.models import Booking, RoomHold, Hotel
from app.repositories.hotel_repository import HotelRepository
from app.services.booking_events import (
    BookingAuditObserver,
    BookingConfirmationObserver,
    BookingEventContext,
    BookingEventSubject,
)


DEFAULT_TAX_RATE = 0.1


@dataclass
class BookingCreationResult:
    booking: Booking
    payload: dict


class BookingService:
    def __init__(self, hotel_repository: HotelRepository | None = None) -> None:
        self.hotel_repository = hotel_repository or HotelRepository()
        self.booking_events = BookingEventSubject()
        self.booking_events.attach(BookingConfirmationObserver())
        self.booking_events.attach(BookingAuditObserver())

    def calculate_price(self, nightly_rate: int, check_in: str, check_out: str, rooms: int) -> dict:
        check_in_date = self._parse_date(check_in)
        check_out_date = self._parse_date(check_out)
        nights = max(1, (check_out_date - check_in_date).days)
        subtotal = nightly_rate * nights * rooms
        taxes_and_fees = round(subtotal * DEFAULT_TAX_RATE)

        return {
            'currency': 'VND',
            'nightly_rate': nightly_rate,
            'nights': nights,
            'rooms': rooms,
            'subtotal': subtotal,
            'taxes_and_fees': taxes_and_fees,
            'total': subtotal + taxes_and_fees,
        }

    @transaction.atomic
    def create_booking(self, payload: dict, user=None) -> BookingCreationResult:
        if payload.get('session_id'):
            RoomHold.objects.filter(session_id=payload['session_id'], is_active=True).update(is_active=False)

        hotel = self.hotel_repository.get_by_id(int(payload['hotel_id']))
        if not hotel:
            raise ValueError('Hotel not found.')

        price = self.calculate_price(
            nightly_rate=int(hotel.get('price_per_night', 0)),
            check_in=payload['check_in'],
            check_out=payload['check_out'],
            rooms=int(payload['guests']['rooms']),
        )

        booking = Booking.objects.create(
            user=user if user and user.is_authenticated else None,
            booking_id=self._generate_booking_id(),
            hotel_id=hotel['id'],
            hotel_name=hotel['name'],
            hotel_thumbnail=hotel.get('thumbnail', ''),
            check_in=payload['check_in'],
            check_out=payload['check_out'],
            guests=payload['guests'],
            customer=payload['customer'],
            payment=payload['payment'],
            status='pending',
            currency=price['currency'],
            total=price['total'],
            price=price,
        )

        event_context = BookingEventContext(
            event_name='booking.created',
            payload={
                'booking_id': booking.booking_id,
                'status': booking.status,
                'hotel_id': booking.hotel_id,
                'hotel_name': booking.hotel_name,
                'check_in': booking.check_in,
                'check_out': booking.check_out,
                'guests': booking.guests,
                'customer_email': booking.customer.get('email', ''),
                'price': booking.price,
                'created_at': booking.created_at.isoformat(),
            },
        )
        event_context = self.booking_events.notify(event_context)

        return BookingCreationResult(
            booking=booking,
            payload=event_context.payload,
        )

    def list_user_bookings(self, user) -> list[dict]:
        return [booking.to_summary() for booking in Booking.objects.filter(user=user).order_by('-created_at')]

    def get_booking(self, booking_id: str, user) -> dict | None:
        booking = Booking.objects.filter(booking_id=booking_id, user=user).first()
        return booking.to_summary() if booking else None

    def _parse_date(self, value: str) -> datetime:
        return datetime.strptime(value, '%Y-%m-%d')

    def _generate_booking_id(self) -> str:
        return f'BK-{uuid4().hex[:10].upper()}'

    @transaction.atomic
    def create_room_hold(self, payload: dict) -> dict:
        hotel_id = payload.get('hotel_id')
        session_id = payload.get('session_id')
        
        if not hotel_id or not session_id:
            raise ValueError('Missing hotel_id or session_id')

        hotel = Hotel.objects.filter(id=hotel_id).first()
        if not hotel:
            raise ValueError('Hotel not found.')

        hold, created = RoomHold.objects.update_or_create(
            session_id=session_id,
            hotel=hotel,
            defaults={
                'hold_id': uuid4().hex,
                'check_in': payload.get('check_in'),
                'check_out': payload.get('check_out'),
                'rooms': int(payload.get('rooms', 1)),
                'expires_at': now() + timedelta(minutes=10),
                'is_active': True
            }
        )
        return {
            'hold_id': hold.hold_id,
            'expires_at': hold.expires_at.isoformat()
        }