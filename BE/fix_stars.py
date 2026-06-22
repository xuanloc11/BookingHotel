import os
import django
import sys
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'BE.settings')
django.setup()

from app.models import Hotel

print("--- Randomizing Hotel Stars ---")
hotels = Hotel.objects.all()
for hotel in hotels:
    hotel.stars = random.choice([3, 4, 5])
    hotel.save()
    print(f"Set hotel ID {hotel.id} to {hotel.stars} stars.")

print("\nAll done!")
