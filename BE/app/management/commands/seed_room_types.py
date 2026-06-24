from django.core.management.base import BaseCommand
from app.models import Hotel, RoomType


ROOM_TEMPLATES = [
    {
        "name": "Standard Room",
        "price_multiplier": 1.0,
        "capacity": 2,
        "available_rooms": 8,
        "features": [
            "Free Wi-Fi",
            "Air Conditioning",
            "Flat-screen TV",
            "Minibar",
            "In-room Safe",
        ],
    },
    {
        "name": "Deluxe Room",
        "price_multiplier": 1.6,
        "capacity": 3,
        "available_rooms": 4,
        "features": [
            "High-speed Wi-Fi",
            "Air Conditioning",
            "55-inch 4K TV",
            "Premium Minibar",
            "In-room Safe",
            "Bathtub",
            "Balcony / Scenic View",
            "24/7 Room Service",
        ],
    },
]


class Command(BaseCommand):
    help = "Thêm 2 loại phòng (Standard & Deluxe) cho mỗi khách sạn chưa có đủ"

    def handle(self, *args, **kwargs):
        hotels = Hotel.objects.all()
        created_count = 0
        skipped_count = 0

        for hotel in hotels:
            for template in ROOM_TEMPLATES:
                price = int(hotel.price_per_night * template["price_multiplier"])

                room, created = RoomType.objects.get_or_create(
                    hotel=hotel,
                    name=template["name"],
                    defaults={
                        "price": price,
                        "capacity": template["capacity"],
                        "available_rooms": template["available_rooms"],
                        "features": template["features"],
                    },
                )

                if created:
                    created_count += 1
                    self.stdout.write(
                        f"  [OK] {hotel.id}: {template['name']} ({price:,} VND)"
                    )
                else:
                    skipped_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"\nDone! Created {created_count} new room types, skipped {skipped_count} existing."
            )
        )
