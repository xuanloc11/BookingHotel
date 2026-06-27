from collections import Counter
from datetime import datetime, timedelta, date
from app.repositories.hotel_repository import HotelRepository
from app.services.hotel_filters import (
    AndExpression,
    AmenitiesExpression,
    LocationExpression,
    PriceRangeExpression,
    StarRatingExpression,
    ReviewScoreExpression,
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
        star_rating: float | None = None,
        stars: int | None = None,
        amenities: list[str] | None = None,
        sort_by: str | None = None,
        check_in: str | None = None,
        check_out: str | None = None,
        rooms_needed: int = 1,
    ) -> list[dict]:
        hotels = self._apply_filters(
            self.repository.list_all(),
            location=location,
            price_min=price_min,
            price_max=price_max,
            star_rating=star_rating,
            stars=stars,
            amenities=amenities,
        )

        # Filter by availability and compute available_rooms if dates are provided
        if check_in and check_out:
            try:
                check_in_date = datetime.fromisoformat(check_in.replace('Z', '')).date()
                check_out_date = datetime.fromisoformat(check_out.replace('Z', '')).date()
                if check_out_date <= check_in_date:
                    check_out_date = check_in_date + timedelta(days=1)
                
                available_hotels = []
                for hotel in hotels:
                    # Get base availability using the same logic as get_hotel_availability
                    booked_rooms_per_date = Counter()
                    bookings = Booking.objects.filter(hotel_id=hotel['id']).exclude(status='cancelled')
                    for booking in bookings:
                        try:
                            b_check_in = datetime.strptime(booking.check_in, '%Y-%m-%d').date()
                            b_check_out = datetime.strptime(booking.check_out, '%Y-%m-%d').date()
                            b_rooms = int(booking.guests.get('rooms', 1))
                            c_date = b_check_in
                            while c_date < b_check_out:
                                booked_rooms_per_date[c_date.isoformat()] += b_rooms
                                c_date += timedelta(days=1)
                        except Exception:
                            pass
                    
                    min_available_rooms = float('inf')
                    today = datetime.utcnow().date()
                    c_date = check_in_date
                    while c_date < check_out_date:
                        date_str = c_date.isoformat()
                        delta_days = (c_date - today).days
                        # Same mocked logic as get_hotel_availability
                        base_available = delta_days % 6 != 5
                        base_rooms = 4 - (delta_days % 3) if base_available else 0
                        booked = booked_rooms_per_date[date_str]
                        remaining = max(0, base_rooms - booked)
                        
                        if remaining < min_available_rooms:
                            min_available_rooms = remaining
                            
                        c_date += timedelta(days=1)
                        
                    if min_available_rooms >= rooms_needed:
                        hotel['available_rooms'] = min_available_rooms
                        available_hotels.append(hotel)
                
                hotels = available_hotels
            except Exception as e:
                print("Error computing availability", e)
                pass

        if sort_by == 'price_asc':
            hotels = sorted(hotels, key=lambda hotel: hotel.get('price_per_night', 0))
        elif sort_by == 'price_desc':
            hotels = sorted(hotels, key=lambda hotel: hotel.get('price_per_night', 0), reverse=True)
        elif sort_by == 'rating_desc':
            hotels = sorted(
                hotels,
                key=lambda hotel: (hotel.get('rating', 0), hotel.get('reviews_count', 0)),
                reverse=True,
            )
        else:
            # Default sorting: highest rating first
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

    def get_hotel_by_identifier(self, identifier: str | int) -> dict | None:
        return self.repository.get_by_slug_or_id(identifier)

    def get_hotel_details(self, identifier: str | int) -> dict | None:
        hotel = self.get_hotel_by_identifier(identifier)
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

    def get_hotel_availability(self, identifier: str | int, room_type_id: int | None = None, start_date: date | None = None, end_date: date | None = None) -> list[dict]:
        hotel = self.get_hotel_by_identifier(identifier)
        if not hotel:
            return []

        hotel_id = hotel['id']
        room_type = None

        from app.models import RoomType
        if room_type_id:
            try:
                room_type = RoomType.objects.get(id=room_type_id, hotel_id=hotel_id)
            except RoomType.DoesNotExist:
                return []

        today = datetime.utcnow().date()
        availability: list[dict] = []
        
        from django.utils.timezone import now
        from app.models import RoomHold
        
        # Calculate booked rooms per date
        booked_rooms_per_date = Counter()
        bookings_qs = Booking.objects.prefetch_related('rooms').filter(hotel_id=hotel_id).exclude(status='cancelled')
        if room_type:
            bookings_qs = bookings_qs.filter(rooms__room_type_id=room_type.id)

        for booking in bookings_qs:
            try:
                check_in_date = datetime.strptime(booking.check_in, '%Y-%m-%d').date()
                check_out_date = datetime.strptime(booking.check_out, '%Y-%m-%d').date()
                
                rooms_count = 0
                if room_type:
                    # Get quantity for specific room type
                    for r in booking.rooms.all():
                        if r.room_type_id == room_type.id:
                            rooms_count += r.quantity
                else:
                    rooms_count = sum(r.quantity for r in booking.rooms.all())
                
                # Iterate through each night of the stay
                current_date = check_in_date
                while current_date < check_out_date:
                    booked_rooms_per_date[current_date.isoformat()] += rooms_count
                    current_date += timedelta(days=1)
            except Exception:
                pass # Ignore malformed bookings

        # Add active holds to booked rooms
        active_holds = RoomHold.objects.filter(hotel_id=hotel_id, is_active=True, expires_at__gt=now())
        for hold in active_holds:
            try:
                check_in_date = datetime.strptime(hold.check_in, '%Y-%m-%d').date()
                check_out_date = datetime.strptime(hold.check_out, '%Y-%m-%d').date()
                rooms = hold.rooms

                current_date = check_in_date
                while current_date < check_out_date:
                    booked_rooms_per_date[current_date.isoformat()] += rooms
                    current_date += timedelta(days=1)
            except Exception:
                pass

        today = datetime.utcnow().date()
        
        calc_start = start_date if start_date else today
        calc_end = end_date if end_date else today + timedelta(days=21)
        
        from app.services.pricing_engine import pricing_engine

        current_date = calc_start
        while current_date < calc_end:
            date_str = current_date.isoformat()
            index = (current_date - today).days
            
            # Base logic
            base_available = index % 6 != 5
            
            if room_type:
                base_rooms = room_type.available_rooms if base_available else 0
                nightly_rate = room_type.price
            else:
                base_rooms = 4 - (index % 3) if base_available else 0
                nightly_rate = hotel.get('price_per_night', 0)
            
            # Subtract booked rooms
            booked = booked_rooms_per_date[date_str]
            remaining_rooms = max(0, base_rooms - booked)
            is_available = remaining_rooms > 0

            # Dynamic pricing
            adjusted_rate = pricing_engine.calculate_price(
                base_price=nightly_rate,
                current_date=current_date,
                capacity=base_rooms,
                booked=booked
            )

            availability.append(
                {
                    'date': date_str,
                    'available_rooms': remaining_rooms,
                    'nightly_rate': adjusted_rate,
                    'is_available': is_available,
                }
            )
            
            current_date += timedelta(days=1)

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
        star_rating: float | None = None,
        stars: int | None = None,
        amenities: list[str] | None = None,
    ) -> list[dict]:
        filter_expression = AndExpression(
            LocationExpression(location),
            PriceRangeExpression(price_min, price_max),
            ReviewScoreExpression(star_rating),
            StarRatingExpression(stars),
            AmenitiesExpression(amenities),
        )
        return [hotel for hotel in hotels if filter_expression.interpret(hotel)]