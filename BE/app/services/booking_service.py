from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from uuid import uuid4

from django.db import transaction

from django.utils.timezone import now
from datetime import timedelta
from app.models import Booking, RoomHold, Hotel, RoomType, BookingRoom
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

    def calculate_price(self, subtotal: int, check_in: str, check_out: str) -> dict:
        check_in_date = self._parse_date(check_in)
        check_out_date = self._parse_date(check_out)
        nights = max(1, (check_out_date - check_in_date).days)
        taxes_and_fees = round(subtotal * DEFAULT_TAX_RATE)

        return {
            'currency': 'VND',
            'nightly_rate': round(subtotal / nights) if nights > 0 else subtotal,
            'nights': nights,
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

        room_selections = payload.get('room_selections', [])
        if not room_selections:
            # Fallback for old requests
            room_selections = []
            if payload.get('room_type_id'):
                room_selections.append({
                    'room_type_id': payload.get('room_type_id'),
                    'quantity': int(payload['guests']['rooms'])
                })

        subtotal = 0
        room_objects_to_create = []
        
        from app.services.hotel_service import HotelService
        hotel_svc = HotelService()

        check_in_date = self._parse_date(payload['check_in']).date()
        check_out_date = self._parse_date(payload['check_out']).date()

        if room_selections:
            # Prevent Race Condition by locking the requested RoomTypes
            room_type_ids = [s['room_type_id'] for s in room_selections]
            list(RoomType.objects.select_for_update().filter(id__in=room_type_ids))

            for selection in room_selections:
                try:
                    room_type = RoomType.objects.get(id=selection['room_type_id'], hotel_id=hotel['id'])
                    qty = int(selection['quantity'])
                    if qty <= 0:
                        raise ValueError(f"Số lượng phòng không hợp lệ ({qty}). Phải lớn hơn 0.")
                    
                    # Verify dynamic availability under lock
                    availability = hotel_svc.get_hotel_availability(hotel['id'], room_type_id=room_type.id, start_date=check_in_date, end_date=check_out_date)
                    
                    c_date = check_in_date
                    room_total_price = 0
                    while c_date < check_out_date:
                        date_str = c_date.isoformat()
                        day_avail = next((item for item in availability if item["date"] == date_str), None)
                        if not day_avail or day_avail['available_rooms'] < qty:
                            raise ValueError(f"Không đủ phòng trống cho loại phòng {room_type.name} vào ngày {date_str}.")
                        room_total_price += day_avail['nightly_rate'] * qty
                        c_date += timedelta(days=1)

                    subtotal += room_total_price
                    nights = max(1, (check_out_date - check_in_date).days)
                    room_objects_to_create.append({
                        'room_type': room_type,
                        'room_type_name': room_type.name,
                        'quantity': qty,
                        'price': round(room_total_price / (nights * qty)) if (nights * qty) > 0 else room_type.price
                    })
                except RoomType.DoesNotExist:
                    pass
        else:
            qty = int(payload['guests']['rooms'])
            if qty <= 0:
                raise ValueError(f"Số lượng phòng không hợp lệ ({qty}). Phải lớn hơn 0.")
            
            availability = hotel_svc.get_hotel_availability(hotel['id'], start_date=check_in_date, end_date=check_out_date)
            
            c_date = check_in_date
            while c_date < check_out_date:
                date_str = c_date.isoformat()
                day_avail = next((item for item in availability if item["date"] == date_str), None)
                if not day_avail or day_avail['available_rooms'] < qty:
                    raise ValueError(f"Không đủ phòng trống vào ngày {date_str}.")
                subtotal += day_avail['nightly_rate'] * qty
                c_date += timedelta(days=1)

        price = self.calculate_price(
            subtotal=subtotal,
            check_in=payload['check_in'],
            check_out=payload['check_out'],
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

        for room_data in room_objects_to_create:
            BookingRoom.objects.create(
                booking=booking,
                room_type=room_data['room_type'],
                room_type_name=room_data['room_type_name'],
                quantity=room_data['quantity'],
                price=room_data['price']
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
                'rooms': [
                    {
                        'room_type_name': r['room_type_name'],
                        'quantity': r['quantity'],
                        'price': r['price']
                    } for r in room_objects_to_create
                ],
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
    def cancel_booking(self, booking_id: str, user) -> dict:
        booking = Booking.objects.filter(booking_id=booking_id, user=user).first()
        if not booking:
            raise ValueError('Booking not found.')
        
        if booking.status == 'cancelled':
            raise ValueError('Booking is already cancelled.')
            
        booking.status = 'cancelled'
        booking.save(update_fields=['status'])
        
        return booking.to_summary()

    @transaction.atomic
    def create_room_hold(self, payload: dict) -> dict:
        hotel_id = payload.get('hotel_id')
        session_id = payload.get('session_id')
        
        if not hotel_id or not session_id:
            raise ValueError('Missing hotel_id or session_id')

        hotel = Hotel.objects.filter(id=hotel_id).first()
        if not hotel:
            raise ValueError('Hotel not found.')

        total_rooms = 0
        from app.services.hotel_service import HotelService
        hotel_svc = HotelService()

        check_in_date = self._parse_date(payload.get('check_in')).date()
        check_out_date = self._parse_date(payload.get('check_out')).date()

        if payload.get('room_selections'):
            total_rooms = sum(int(sel['quantity']) for sel in payload['room_selections'])
            
            # Prevent Race Condition by locking the requested RoomTypes
            room_type_ids = [s['room_type_id'] for s in payload['room_selections']]
            list(RoomType.objects.select_for_update().filter(id__in=room_type_ids))
            
            for selection in payload['room_selections']:
                try:
                    room_type = RoomType.objects.get(id=selection['room_type_id'], hotel_id=hotel_id)
                    qty = int(selection['quantity'])
                    if qty <= 0:
                        raise ValueError(f"Số lượng phòng không hợp lệ ({qty}). Phải lớn hơn 0.")
                    
                    availability = hotel_svc.get_hotel_availability(hotel_id, room_type_id=room_type.id, start_date=check_in_date, end_date=check_out_date)
                    
                    c_date = check_in_date
                    while c_date < check_out_date:
                        date_str = c_date.isoformat()
                        day_avail = next((item for item in availability if item["date"] == date_str), None)
                        if not day_avail or day_avail['available_rooms'] < qty:
                            raise ValueError(f"Không đủ phòng trống cho loại phòng {room_type.name} vào ngày {date_str}.")
                        c_date += timedelta(days=1)
                except RoomType.DoesNotExist:
                    pass
        else:
            total_rooms = int(payload.get('rooms', 1))
            if total_rooms <= 0:
                raise ValueError("Số lượng phòng không hợp lệ. Phải lớn hơn 0.")
            # Optional: lock hotel if not using room types (omitted for brevity as default behavior)


        hold, created = RoomHold.objects.update_or_create(
            session_id=session_id,
            hotel=hotel,
            defaults={
                'hold_id': uuid4().hex,
                'check_in': payload.get('check_in'),
                'check_out': payload.get('check_out'),
                'rooms': total_rooms,
                'expires_at': now() + timedelta(minutes=10),
                'is_active': True
            }
        )
        return {
            'hold_id': hold.hold_id,
            'expires_at': hold.expires_at.isoformat()
        }