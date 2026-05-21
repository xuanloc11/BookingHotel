from collections import Counter

from app.repositories.hotel_repository import HotelRepository


class HotelService:
    def __init__(self, repository: HotelRepository | None = None) -> None:
        self.repository = repository or HotelRepository()

    def list_hotels(self, limit: int | None = None) -> list[dict]:
        hotels = sorted(
            self.repository.list_all(),
            key=lambda hotel: (hotel.get('rating', 0), hotel.get('reviews_count', 0)),
            reverse=True,
        )

        if limit is not None:
            return hotels[:limit]

        return hotels

    def list_provinces(self) -> list[dict]:
        province_counts = Counter(hotel.get('province', 'Unknown') for hotel in self.repository.list_all())
        return [
            {'name': province_name, 'hotel_count': count}
            for province_name, count in sorted(province_counts.items(), key=lambda item: item[0])
        ]