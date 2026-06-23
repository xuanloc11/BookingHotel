import os
import json
import django
from pathlib import Path

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'BE.settings')
django.setup()

from app.models import Hotel

root_path = Path(__file__).resolve().parents[1]
json_file = root_path / 'FE' / 'public' / 'data' / 'hotels_vietnam.json'

with json_file.open('r', encoding='utf-8') as f:
    hotels_data = json.load(f)

print("--- Importing Unsplash Images ---")
count = 0
for h_data in hotels_data:
    try:
        hotel = Hotel.objects.get(id=h_data['id'])
        if 'thumbnail' in h_data and h_data['thumbnail']:
            hotel.thumbnail = h_data['thumbnail']
            hotel.save()
            count += 1
    except Hotel.DoesNotExist:
        pass

print(f"Updated images for {count} hotels.")
