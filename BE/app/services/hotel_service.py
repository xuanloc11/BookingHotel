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
                from app.models import RoomAvailability, RoomType, RoomHold
                from django.utils.timezone import now
                
                for hotel in hotels:
                    room_types = RoomType.objects.filter(hotel_id=hotel['id'])
                    has_available_room_type = False
                    max_hotel_available = 0
                    
                    # Compute Soft Holds
                    active_holds = RoomHold.objects.filter(hotel_id=hotel['id'], is_active=True, expires_at__gt=now())
                    held_rooms_per_date_per_rt = {}
                    for hold in active_holds:
                        try:
                            h_in = datetime.strptime(hold.check_in, '%Y-%m-%d').date()
                            h_out = datetime.strptime(hold.check_out, '%Y-%m-%d').date()
                            rt_id = hold.room_type_id
                            if rt_id not in held_rooms_per_date_per_rt:
                                held_rooms_per_date_per_rt[rt_id] = Counter()
                            
                            c_date = h_in
                            while c_date < h_out:
                                held_rooms_per_date_per_rt[rt_id][c_date] += hold.rooms
                                c_date += timedelta(days=1)
                        except Exception:
                            pass
                    
                    for rt in room_types:
                        days_count = (check_out_date - check_in_date).days
                        availabilities = RoomAvailability.objects.filter(
                            room_type=rt,
                            date__gte=check_in_date,
                            date__lt=check_out_date
                        )
                        
                        if availabilities.count() == days_count:
                            valid_rt = True
                            rt_min_avail = float('inf')
                            for a in availabilities:
                                held = held_rooms_per_date_per_rt.get(rt.id, Counter())[a.date]
                                remaining = a.available_rooms - held
                                if remaining < rooms_needed:
                                    valid_rt = False
                                    break
                                if remaining < rt_min_avail:
                                    rt_min_avail = remaining
                                    
                            if valid_rt:
                                has_available_room_type = True
                                if rt_min_avail > max_hotel_available:
                                    max_hotel_available = rt_min_avail
                                
                    if has_available_room_type:
                        hotel['available_rooms'] = max_hotel_available
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

    def get_hotel_availability(self, identifier: str | int, room_type_id: int | None = None, start_date: date | None = None, end_date: date | None = None, user_role: str = 'guest') -> list[dict]:
        hotel = self.get_hotel_by_identifier(identifier)
        if not hotel:
            return []

        hotel_id = hotel['id']
        room_type = None

        from app.models import RoomType, RoomAvailability
        if room_type_id:
            try:
                room_type = RoomType.objects.get(id=room_type_id, hotel_id=hotel_id)
            except RoomType.DoesNotExist:
                return []

        today = datetime.utcnow().date()
        calc_start = start_date if start_date else today
        calc_end = end_date if end_date else today + timedelta(days=21)

        from django.utils.timezone import now
        from app.models import RoomHold

        # Add active holds to booked rooms (Soft Locks)
        held_rooms_per_date = Counter()
        active_holds = RoomHold.objects.filter(hotel_id=hotel_id, is_active=True, expires_at__gt=now())
        if room_type:
            active_holds = active_holds.filter(room_type=room_type)

        for hold in active_holds:
            try:
                h_check_in = datetime.strptime(hold.check_in, '%Y-%m-%d').date()
                h_check_out = datetime.strptime(hold.check_out, '%Y-%m-%d').date()
                h_rooms = hold.rooms

                current_date = h_check_in
                while current_date < h_check_out:
                    held_rooms_per_date[current_date.isoformat()] += h_rooms
                    current_date += timedelta(days=1)
            except Exception:
                pass

        availability: list[dict] = []

        if room_type:
            availabilities = RoomAvailability.objects.filter(
                room_type=room_type,
                date__gte=calc_start,
                date__lt=calc_end
            )
            avail_dict = {a.date.isoformat(): a for a in availabilities}
            
            current_date = calc_start
            while current_date < calc_end:
                date_str = current_date.isoformat()
                a_record = avail_dict.get(date_str)
                
                if a_record:
                    held = held_rooms_per_date[date_str]
                    remaining = max(0, a_record.available_rooms - held)
                    availability.append({
                        'date': date_str,
                        'available_rooms': remaining,
                        'nightly_rate': a_record.price,
                        'is_available': remaining > 0,
                    })
                else:
                    availability.append({
                        'date': date_str,
                        'available_rooms': 0,
                        'nightly_rate': room_type.base_price,
                        'is_available': False,
                    })
                current_date += timedelta(days=1)
        else:
            room_types = RoomType.objects.filter(hotel_id=hotel_id)
            availabilities = RoomAvailability.objects.filter(
                room_type__in=room_types,
                date__gte=calc_start,
                date__lt=calc_end
            )
            
            from collections import defaultdict
            date_agg = defaultdict(lambda: {'rooms': 0, 'min_price': float('inf')})
            
            # Group soft holds per room type
            all_holds = RoomHold.objects.filter(hotel_id=hotel_id, is_active=True, expires_at__gt=now())
            held_rt_date = defaultdict(Counter)
            for h in all_holds:
                try:
                    h_in = datetime.strptime(h.check_in, '%Y-%m-%d').date()
                    h_out = datetime.strptime(h.check_out, '%Y-%m-%d').date()
                    c_date = h_in
                    while c_date < h_out:
                        held_rt_date[h.room_type_id][c_date.isoformat()] += h.rooms
                        c_date += timedelta(days=1)
                except Exception: pass
            
            for a in availabilities:
                date_str = a.date.isoformat()
                held = held_rt_date[a.room_type_id][date_str]
                real_avail = max(0, a.available_rooms - held)
                date_agg[date_str]['rooms'] += real_avail
                if a.price < date_agg[date_str]['min_price']:
                    date_agg[date_str]['min_price'] = a.price
            
            current_date = calc_start
            while current_date < calc_end:
                date_str = current_date.isoformat()
                agg = date_agg[date_str]
                
                remaining = agg['rooms']
                price = agg['min_price'] if agg['min_price'] != float('inf') else hotel.get('price_per_night', 0)
                
                availability.append({
                    'date': date_str,
                    'available_rooms': remaining,
                    'nightly_rate': price,
                    'is_available': remaining > 0,
                })
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