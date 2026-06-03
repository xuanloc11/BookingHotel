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

        for index in range(21):
            date_value = today + timedelta(days=index)
            is_available = index % 6 != 5
            availability.append(
                {
                    'date': date_value.isoformat(),
                    'available_rooms': 4 - (index % 3) if is_available else 0,
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