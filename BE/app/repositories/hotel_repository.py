from app.models import Hotel


class HotelRepository:
    def _hotel_to_dict(self, hotel: Hotel, include_rooms: bool = False) -> dict:
        data = {
            'id': hotel.id,
            'slug': hotel.slug,
            'name': hotel.name,
            'province': hotel.province,
            'address': hotel.address,
            'price_per_night': hotel.price_per_night,
            'stars': hotel.stars,
            'rating': hotel.rating,
            'reviews_count': hotel.reviews_count,
            'amenities': hotel.amenities,
            'thumbnail': hotel.thumbnail,
            'description': hotel.description,
            'status': hotel.status,
        }
        if include_rooms:
            data['room_types'] = [
                {
                    'id': r.id,
                    'name': r.name,
                    'price': r.price,
                    'capacity': r.capacity,
                    'available_rooms': r.available_rooms,
                    'features': r.features,
                }
                for r in hotel.room_types.all()
            ]
        return data

    def list_all(self) -> list[dict]:
        hotels = Hotel.objects.filter(status=Hotel.STATUS_APPROVED)
        return [self._hotel_to_dict(hotel) for hotel in hotels]

    def get_by_id(self, hotel_id: int) -> dict | None:
        try:
            hotel = Hotel.objects.get(id=hotel_id, status=Hotel.STATUS_APPROVED)
            return self._hotel_to_dict(hotel, include_rooms=True)
        except Hotel.DoesNotExist:
            return None

    def get_by_slug_or_id(self, identifier: str | int) -> dict | None:
        try:
            hotel = Hotel.objects.get(slug=identifier, status=Hotel.STATUS_APPROVED)
            return self._hotel_to_dict(hotel, include_rooms=True)
        except Hotel.DoesNotExist:
            try:
                if isinstance(identifier, str) and identifier.isdigit() or isinstance(identifier, int):
                    hotel = Hotel.objects.get(id=int(identifier), status=Hotel.STATUS_APPROVED)
                    return self._hotel_to_dict(hotel, include_rooms=True)
            except Hotel.DoesNotExist:
                pass
            return None