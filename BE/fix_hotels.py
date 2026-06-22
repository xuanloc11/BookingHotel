import os
import django
import sys

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'BE.settings')
django.setup()

from app.models import Hotel, Profile
from django.contrib.auth import get_user_model

User = get_user_model()

# 1. Replace broken Unsplash images with local safe assets
local_images = [
    '/assets/images/thumbs/destination-details-thumb1.jpg',
    '/assets/images/thumbs/room-details-thumb1.jpg',
    '/assets/images/thumbs/service-thumb1.jpg',
    '/assets/images/thumbs/package-thumb1.jpg',
    '/assets/images/thumbs/gallery-two-thumb1.jpg'
]

print("--- Fixing broken thumbnails ---")
hotels = Hotel.objects.all()
img_idx = 0
for hotel in hotels:
    if 'unsplash.com' in hotel.thumbnail or not hotel.thumbnail:
        hotel.thumbnail = local_images[img_idx % len(local_images)]
        img_idx += 1
        hotel.save()
        print(f"Fixed thumbnail for: {hotel.name} -> {hotel.thumbnail}")

# 2. Create Vendor Users and assign hotels
print("\n--- Creating Vendor Accounts ---")
def create_vendor(email, password, full_name):
    username = email.split('@')[0]
    user, created = User.objects.get_or_create(
        email=email, 
        defaults={'username': username, 'is_staff': False, 'is_superuser': False}
    )
    if created or not user.check_password(password):
        user.set_password(password)
        user.save()
    
    profile, p_created = Profile.objects.get_or_create(
        user=user,
        defaults={'full_name': full_name, 'role': Profile.ROLE_VENDOR}
    )
    if not p_created and profile.role != Profile.ROLE_VENDOR:
        profile.role = Profile.ROLE_VENDOR
        profile.save()
        
    return user

print("\n--- Assigning Hotels to Vendors ---")
for i, hotel in enumerate(hotels):
    if hotel.owner is None:
        # Do quan hệ là OneToOne, mỗi khách sạn phải có 1 Vendor riêng
        vendor_email = f"partner{i+1}@bookinghotel.com"
        vendor = create_vendor(vendor_email, '12345678', f"{hotel.name} Partner")
        hotel.owner = vendor
        try:
            hotel.save()
            print(f"Assigned '{hotel.name}' to {vendor_email} (Password: 12345678)")
        except Exception as e:
            print(f"Could not assign {hotel.name}: {e}")

print("\nAll done!")
