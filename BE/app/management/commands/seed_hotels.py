import json
from pathlib import Path
from django.core.management.base import BaseCommand
from app.models import Hotel, RoomType

class Command(BaseCommand):
    help = 'Seed hotels from JSON file into the database'

    def handle(self, *args, **kwargs):
        root_path = Path(__file__).resolve().parents[4]
        json_file = root_path / 'FE' / 'public' / 'data' / 'hotels_vietnam.json'

        if not json_file.exists():
            self.stdout.write(self.style.ERROR(f"File not found: {json_file}"))
            return

        with json_file.open('r', encoding='utf-8') as f:
            hotels_data = json.load(f)

        hotels_created = 0
        rooms_created = 0

        for h_data in hotels_data:
            # We skip owner assigning for now, Admin can assign later or Owners can claim them
            hotel, created = Hotel.objects.update_or_create(
                id=h_data.get('id'),
                defaults={
                    'name': h_data.get('name', ''),
                    'province': h_data.get('province', ''),
                    'address': h_data.get('address', ''),
                    'price_per_night': h_data.get('price_per_night', 0),
                    'rating': h_data.get('rating', 0.0),
                    'reviews_count': h_data.get('reviews_count', 0),
                    'amenities': h_data.get('amenities', []),
                    'thumbnail': h_data.get('thumbnail', ''),
                    'description': h_data.get('description', ''),
                    'stars': h_data.get('stars', 3),
                }
            )
            if created:
                hotels_created += 1
            
            # Create rooms if provided in JSON, else fallback to default Standard Room
            rooms_data = h_data.get('rooms', [])
            if rooms_data:
                for r_data in rooms_data:
                    room, r_created = RoomType.objects.get_or_create(
                        hotel=hotel,
                        name=r_data.get('name', 'Standard Room'),
                        defaults={
                            'price': r_data.get('price', h_data.get('price_per_night', 0)),
                            'capacity': r_data.get('capacity', 2),
                            'available_rooms': r_data.get('available_rooms', 5),
                            'features': r_data.get('features', ["Free Wi-Fi", "Air Conditioning", "TV"])
                        }
                    )
                    if r_created:
                        rooms_created += 1
            else:
                room, r_created = RoomType.objects.get_or_create(
                    hotel=hotel,
                    name="Standard Room",
                    defaults={
                        'price': h_data.get('price_per_night', 0),
                        'capacity': 2,
                        'available_rooms': 5,
                        'features': ["Free Wi-Fi", "Air Conditioning", "TV"]
                    }
                )
                if r_created:
                    rooms_created += 1

        self.stdout.write(self.style.SUCCESS(f"Successfully seeded {hotels_created} hotels and {rooms_created} rooms."))
