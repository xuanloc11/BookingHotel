from collections import Counter
from datetime import datetime, timedelta

from app.repositories.hotel_repository import HotelRepository
from app.patterns.interpreter import (
    AndExpression,
    AmenitiesExpression,
    LocationExpression,
    PriceRangeExpression,
    StarRatingExpression,
)
from app.models import Booking


class HotelService:
    def __init__(self, repository: HotelRepository | None = None) -> None:
        self.repository = repository or HotelRepository()

    def list_hotels(
        self,
        limit: int | None = None,
        location: str | None = None,
        price_min: int | None = None,
        price_max: int | None = None,
        star_rating: int | None = None,
        amenities: list[str] | None = None,
    ) -> list[dict]:
        hotels = self._apply_filters(
            self.repository.list_all(),
            location=location,
            price_min=price_min,
            price_max=price_max,
            star_rating=star_rating,
            amenities=amenities,
        )

        hotels = sorted(
            hotels,
            key=lambda hotel: (hotel.get('rating', 0), hotel.get('reviews_count', 0)),
            reverse=True,
        )

        if limit is not None:
            return hotels[:limit]

        return hotels

    def get_hotel_by_id(self, hotel_id: int) -> dict | None:
        return self.repository.get_by_id(hotel_id)

    def get_hotel_details(self, hotel_id: int) -> dict | None:
        hotel = self.get_hotel_by_id(hotel_id)
        if not hotel:
            return None

        return {
            **hotel,
            'images': [
                hotel['thumbnail'],
                '/assets/images/thumbs/room-details-thumb1.jpg',
                '/assets/images/thumbs/room-details-thumb2.jpg',
                '/assets/images/thumbs/room-details-thumb3.jpg',
            ],
        }

    def get_hotel_availability(self, hotel_id: int) -> list[dict]:
        hotel = self.get_hotel_by_id(hotel_id)
        if not hotel:
            return []

        today = datetime.utcnow().date()
        availability: list[dict] = []
        
        # Calculate booked rooms per date
        booked_rooms_per_date = Counter()
        bookings = Booking.objects.filter(hotel_id=hotel_id).exclude(status='cancelled')
        for booking in bookings:
            try:
                check_in_date = datetime.strptime(booking.check_in, '%Y-%m-%d').date()
                check_out_date = datetime.strptime(booking.check_out, '%Y-%m-%d').date()
                rooms = int(booking.guests.get('rooms', 1))
                
                # Iterate through each night of the stay
                current_date = check_in_date
                while current_date < check_out_date:
                    booked_rooms_per_date[current_date.isoformat()] += rooms
                    current_date += timedelta(days=1)
            except Exception:
                pass # Ignore malformed bookings

        for index in range(21):
            date_value = today + timedelta(days=index)
            date_str = date_value.isoformat()
            
            # Base logic
            base_available = index % 6 != 5
            base_rooms = 4 - (index % 3) if base_available else 0
            
            # Subtract booked rooms
            booked = booked_rooms_per_date[date_str]
            remaining_rooms = max(0, base_rooms - booked)
            is_available = remaining_rooms > 0

            availability.append(
                {
                    'date': date_str,
                    'available_rooms': remaining_rooms,
                    'nightly_rate': hotel.get('price_per_night', 0),
                    'is_available': is_available,
                }
            )

        return availability

    def list_provinces(self) -> list[dict]:
        province_counts = Counter(hotel.get('province', 'Unknown') for hotel in self.repository.list_all())
        return [
            {'name': province_name, 'hotel_count': count}
            for province_name, count in sorted(province_counts.items(), key=lambda item: item[0])
        ]

    def _apply_filters(
        self,
        hotels: list[dict],
        location: str | None = None,
        price_min: int | None = None,
        price_max: int | None = None,
        star_rating: int | None = None,
        amenities: list[str] | None = None,
    ) -> list[dict]:
        expression = AndExpression(
            LocationExpression(location),
            PriceRangeExpression(price_min=price_min, price_max=price_max),
            StarRatingExpression(star_rating),
            AmenitiesExpression(amenities),
        )
        return [hotel for hotel in hotels if expression.interpret(hotel)]