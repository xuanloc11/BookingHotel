import os
import django
import random
import unicodedata

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'BE.settings')
django.setup()

from app.models import Booking

first_names = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý"]
middle_names = ["Thị", "Văn", "Thị Ngọc", "Đức", "Minh", "Thanh", "Hoàng", "Hữu", "Xuân", "Thành", "Ngọc", "Gia"]
last_names = ["Anh", "Minh", "Trang", "Hùng", "Dũng", "Tuấn", "Đức", "Thành", "Thảo", "Ngọc", "Hà", "Hương", "Lan", "Sơn", "Tùng", "Phương", "Khang", "Vy", "Linh", "Quân"]

def strip_accents(s):
    s = s.replace('đ', 'd').replace('Đ', 'D')
    return ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn')

bookings = Booking.objects.all()
updated_count = 0

for b in bookings:
    customer = b.customer
    if not isinstance(customer, dict):
        continue
        
    email = customer.get('email', '')
    first_name = customer.get('first_name', '')
    last_name = customer.get('last_name', '')
    
    if 'example.com' in email or 'Mock' in first_name or 'Mock' in last_name or 'Guest' in first_name or 'Guest' in last_name:
        f_name = random.choice(first_names)
        m_name = random.choice(middle_names)
        l_name = random.choice(last_names)
        
        full_first = f_name
        full_last = f"{m_name} {l_name}"
        
        email_prefix = f"{strip_accents(f_name).lower()}{strip_accents(l_name).lower()}{random.randint(1970, 2005)}"
        new_email = f"{email_prefix}@gmail.com"
        
        phone_prefixes = ["090", "091", "092", "093", "094", "096", "097", "098", "086", "088", "089", "070", "079", "077", "076", "078"]
        new_phone = f"{random.choice(phone_prefixes)}{random.randint(1000000, 9999999)}"
        
        customer['first_name'] = full_first
        customer['last_name'] = full_last
        customer['email'] = new_email
        customer['phone'] = new_phone
        
        b.customer = customer
        b.save(update_fields=['customer'])
        updated_count += 1

print(f"Updated {updated_count} mock bookings to realistic names and @gmail.com emails.")
