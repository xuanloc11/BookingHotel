import os
import django
import sys
import uuid
import random
from datetime import timedelta, date, datetime

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'BE.settings')
django.setup()

from app.models import Hotel, RoomType, Booking, BookingRoom, Transaction
from django.utils import timezone

def remove_accents(input_str):
    s1 = u'ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝàáâãèéêìíòóôõùúýĂăĐđĨĩŨũƠơƯưẠạẢảẤấẦầẨẩẪẫẬậẮắẰằẲẳẴẵẶặẸẹẺẻẼẽẾếỀềỂểỄễỆệỈỉỊịỌọỎỏỐốỒồỔổỖỗỘộỚớỜờỞởỠỡỢợỤụỦủỨứỪừỬửỮữỰựỲỳỴỵỶỷỸỹ'
    s0 = u'AAAAEEEIIOOOOUUYaaaaeeeiioooouuyAaDdIiUuOoUuAaAaAaAaAaAaAaAaAaAaAaAaEeEeEeEeEeEeEeEeIiIiOoOoOoOoOoOoOoOoOoOoOoOoUuUuUuUuUuUuUuYyYyYyYy'
    s = ''
    for c in input_str:
        if c in s1:
            s += s0[s1.index(c)]
        else:
            s += c
    return s

def generate_bookings():
    hotels = Hotel.objects.all()
    if not hotels:
        print("No hotels found in the database. Please create hotels first.")
        return

    statuses = [Booking.STATUS_COMPLETED, Booking.STATUS_CONFIRMED, Booking.STATUS_CANCELLED]
    first_names = ["An", "Bình", "Cường", "Dung", "Em", "Phúc", "Giang", "Hương", "Linh", "Minh", "Nga", "Oanh", "Phong", "Quân", "Tuấn"]
    last_names = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng", "Bùi", "Đỗ"]

    print(f"Generating 10 bookings for TODAY for each hotel...")

    for hotel in hotels:
        room_types = list(RoomType.objects.filter(hotel=hotel))
        if not room_types:
            continue

        for _ in range(10):
            now = timezone.now()
            # Force check_in to be around today (from -2 to +5 days)
            days_offset_start = random.randint(-2, 5)
            check_in_date = (now + timedelta(days=days_offset_start)).date()
            nights = random.randint(1, 5)
            check_out_date = check_in_date + timedelta(days=nights)
            
            # FORCE created_at_dt to be TODAY (with some random hours/minutes)
            created_at_dt = now - timedelta(hours=random.randint(0, 10), minutes=random.randint(0, 59))

            booking_status = random.choice(statuses)

            num_room_types = random.choice([1, 2]) if len(room_types) >= 2 else 1
            selected_room_types = random.sample(room_types, num_room_types)
            
            customer_fn = random.choice(first_names)
            customer_ln = random.choice(last_names)
            customer_phone = f"09{random.randint(10000000, 99999999)}"

            email_fn = remove_accents(customer_fn).lower()
            email_ln = remove_accents(customer_ln).lower()
            customer_email = f"{email_fn}.{email_ln}@gmail.com"

            hotel_thumbnail = hotel.thumbnail

            booking = Booking(
                booking_id=f"BK-{uuid.uuid4().hex[:8].upper()}",
                hotel=hotel,
                hotel_name=hotel.name,
                hotel_thumbnail=hotel_thumbnail,
                check_in=check_in_date.isoformat(),
                check_out=check_out_date.isoformat(),
                guests={"adults": random.randint(1, 4), "children": random.randint(0, 2)},
                customer={"first_name": customer_fn, "last_name": customer_ln, "email": customer_email, "phone": customer_phone},
                payment={"method": "CREDIT_CARD", "status": "PAID" if booking_status == Booking.STATUS_COMPLETED else "PENDING"},
                status=booking_status,
                currency="VND",
                total=0,
            )
            
            booking.save()
            booking.created_at = created_at_dt
            booking.save(update_fields=['created_at'])

            total_amount = 0

            for rt in selected_room_types:
                qty = random.randint(1, 2)
                price = rt.price
                room_total = qty * price * nights
                total_amount += room_total

                BookingRoom.objects.create(
                    booking=booking,
                    room_type=rt,
                    room_type_name=rt.name,
                    quantity=qty,
                    price=price
                )

            booking.total = total_amount
            booking.price = {"room_total": total_amount, "taxes": 0, "final_total": total_amount}
            booking.save(update_fields=['total', 'price'])

            if booking_status == Booking.STATUS_COMPLETED:
                commission = int(total_amount * 0.15)
                net = total_amount - commission
                
                txn = Transaction.objects.create(
                    hotel=hotel,
                    transaction_id=f"TXN-{uuid.uuid4().hex[:8].upper()}",
                    type=Transaction.TYPE_REVENUE,
                    amount=total_amount,
                    commission_fee=commission,
                    net_amount=net,
                    description=f"Doanh thu từ đơn đặt phòng {booking.booking_id}",
                    status=Transaction.STATUS_COMPLETED
                )
                txn.created_at = created_at_dt
                txn.save(update_fields=['created_at'])

        print(f"Created 10 TODAY bookings for hotel ID {hotel.id}")

    print("Successfully seeded TODAY bookings data!")

if __name__ == '__main__':
    generate_bookings()
