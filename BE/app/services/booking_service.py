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

        # Chống Double-Booking (Lớp 1)
        customer = payload.get('customer', {})
        email = customer.get('email', '')
        phone = customer.get('phone', '')
        
        if email or phone:
            ten_minutes_ago = now() - timedelta(minutes=10)
            from django.db.models import Q
            contact_q = Q()
            if email:
                contact_q |= Q(customer__email=email)
            if phone:
                contact_q |= Q(customer__phone=phone)
                
            recent_duplicate = Booking.objects.filter(
                hotel_id=int(payload['hotel_id']),
                check_in=payload['check_in'],
                check_out=payload['check_out'],
                created_at__gte=ten_minutes_ago
            ).filter(contact_q).exists()
            
            if recent_duplicate:
                raise ValueError('Hệ thống ghi nhận bạn vừa đặt thành công đơn này cách đây ít phút. Vui lòng kiểm tra Email hoặc tra cứu đơn hàng để tránh đặt trùng. Nếu bạn muốn đặt thêm phòng, vui lòng quay lại trang chọn phòng và tăng số lượng.')

        hotel = self.hotel_repository.get_by_id(int(payload['hotel_id']))
        if not hotel:
            raise ValueError('Hotel not found.')
        
        # Serialize booking creations for this hotel to prevent race condition overbooking
        hotel_model = Hotel.objects.select_for_update().get(id=int(payload['hotel_id']))

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

        from app.models import RoomAvailability
        from django.db.models import F

        if room_selections:
            for selection in room_selections:
                try:
                    room_type = RoomType.objects.get(id=selection['room_type_id'], hotel_id=hotel['id'])
                    qty = int(selection['quantity'])
                    if qty <= 0:
                        raise ValueError(f"Số lượng phòng không hợp lệ ({qty}). Phải lớn hơn 0.")
                    
                    days_count = (check_out_date - check_in_date).days
                    availabilities = RoomAvailability.objects.filter(
                        room_type=room_type,
                        date__gte=check_in_date,
                        date__lt=check_out_date
                    )
                    
                    if availabilities.count() != days_count:
                        raise ValueError(f"Không có đủ dữ liệu phòng trống cho loại phòng {room_type.name} trong khoảng thời gian này.")

                    room_total_price = 0
                    for day_avail in availabilities:
                        if day_avail.available_rooms < qty:
                            raise ValueError(f"Không đủ phòng trống cho loại phòng {room_type.name} vào ngày {day_avail.date}.")
                        
                        # Optimistic Locking update
                        updated = RoomAvailability.objects.filter(
                            id=day_avail.id,
                            version=day_avail.version,
                            available_rooms__gte=qty
                        ).update(
                            available_rooms=F('available_rooms') - qty,
                            version=F('version') + 1
                        )
                        if updated == 0:
                            raise ValueError(f"Race Condition: Phòng {room_type.name} vào ngày {day_avail.date} vừa được khách khác đặt. Vui lòng thử lại!")
                        
                        room_total_price += day_avail.price * qty

                    subtotal += room_total_price
                    nights = max(1, days_count)
                    room_objects_to_create.append({
                        'room_type': room_type,
                        'room_type_name': room_type.name,
                        'quantity': qty,
                        'price': round(room_total_price / (nights * qty)) if (nights * qty) > 0 else room_type.base_price
                    })
                except RoomType.DoesNotExist:
                    pass
        else:
            raise ValueError("Vui lòng chọn loại phòng cụ thể (room_selections).")

        price = self.calculate_price(
            subtotal=subtotal,
            check_in=payload['check_in'],
            check_out=payload['check_out'],
        )

        # Determine group booking (>= 10 rooms)
        total_rooms_booked = 0
        if room_selections:
            total_rooms_booked = sum(int(s['quantity']) for s in room_selections)
        else:
            total_rooms_booked = int(payload['guests']['rooms'])
        
        is_group_booking = total_rooms_booked >= 10

        # Calculate deposit and cancellation deadline
        deposit_amount = int(price['total'] * (hotel.get('deposit_percentage', 0) / 100))
        cancellation_deadline = None
        if hotel.get('cancellation_free_days', 0) > 0:
            cancellation_deadline = check_in_date - timedelta(days=hotel.get('cancellation_free_days', 0))

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
            deposit_amount=deposit_amount,
            is_deposit_paid=False,
            cancellation_deadline=cancellation_deadline,
            is_refundable=hotel_model.is_refundable,
            is_group_booking=is_group_booking,
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
                'deposit_amount': booking.deposit_amount,
                'is_group_booking': booking.is_group_booking,
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
        return [booking.to_summary() for booking in Booking.objects.filter(user=user).prefetch_related('rooms').order_by('-created_at')]

    def get_booking(self, booking_id: str, user) -> dict | None:
        booking = Booking.objects.filter(booking_id=booking_id, user=user).first()
        return booking.to_summary() if booking else None

    def get_guest_booking(self, booking_id: str, contact_info: str) -> dict | None:
        booking = Booking.objects.filter(booking_id=booking_id).first()
        if not booking:
            return None
        
        customer_email = booking.customer.get('email', '')
        customer_phone = booking.customer.get('phone', '')
        
        # User explicitly requested to allow matching BOTH email and phone
        if contact_info.lower() == customer_email.lower() or contact_info == customer_phone:
            return booking.to_summary()
            
        return None

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
            
        cancellation_fee = 0
        if not booking.is_refundable:
            cancellation_fee = booking.total
        elif booking.cancellation_deadline:
            if now() > booking.cancellation_deadline:
                cancellation_fee = booking.deposit_amount
        elif booking.check_in:
            check_in_dt = self._parse_date(booking.check_in).replace(tzinfo=now().tzinfo) if self._parse_date(booking.check_in).tzinfo is None else self._parse_date(booking.check_in)
            if now() > check_in_dt:
                cancellation_fee = booking.deposit_amount
                
        booking.status = 'cancelled'
        booking.cancellation_fee = cancellation_fee
        booking.save(update_fields=['status', 'cancellation_fee'])
        
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

        RoomHold.objects.filter(session_id=session_id, hotel=hotel).delete()

        if payload.get('room_selections'):
            for selection in payload['room_selections']:
                try:
                    room_type = RoomType.objects.get(id=selection['room_type_id'], hotel_id=hotel_id)
                    qty = int(selection['quantity'])
                    if qty <= 0:
                        continue
                    
                    availability = hotel_svc.get_hotel_availability(hotel_id, room_type_id=room_type.id, start_date=check_in_date, end_date=check_out_date)
                    
                    c_date = check_in_date
                    while c_date < check_out_date:
                        date_str = c_date.isoformat()
                        day_avail = next((item for item in availability if item["date"] == date_str), None)
                        if not day_avail or day_avail['available_rooms'] < qty:
                            raise ValueError(f"Không đủ phòng trống cho loại phòng {room_type.name} vào ngày {date_str}.")
                        c_date += timedelta(days=1)
                        
                    RoomHold.objects.create(
                        session_id=session_id,
                        hotel=hotel,
                        room_type=room_type,
                        hold_id=uuid4().hex,
                        check_in=payload.get('check_in'),
                        check_out=payload.get('check_out'),
                        rooms=qty,
                        expires_at=now() + timedelta(minutes=10),
                        is_active=True
                    )
                except RoomType.DoesNotExist:
                    pass
        else:
            raise ValueError("Vui lòng chọn loại phòng cụ thể (room_selections) để giữ chỗ.")

        return {
            'session_id': session_id,
            'expires_at': (now() + timedelta(minutes=10)).isoformat()
        }