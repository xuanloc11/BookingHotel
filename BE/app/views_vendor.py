import json

from django.http import HttpRequest, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.shortcuts import get_object_or_404
from django.db.models import Sum, Count

from app.models import Profile, Hotel, RoomType, Booking
from app.views import _get_authenticated_user, _json_error, _parse_json_body


def _is_vendor(user) -> bool:
    if not user:
        return False
    if user.is_superuser:
        return True
    profile = Profile.objects.filter(user=user).first()
    return profile and profile.role in [Profile.ROLE_VENDOR, Profile.ROLE_ADMIN]


def vendor_required(view_func):
    def wrapper(request: HttpRequest, *args, **kwargs):
        user = _get_authenticated_user(request)
        if not user or not _is_vendor(user):
            return _json_error('Vendor authentication required.', status=403)
        return view_func(request, user, *args, **kwargs)
    return wrapper


@csrf_exempt
@require_http_methods(['GET'])
@vendor_required
def dashboard_stats(request, user):
    hotel = getattr(user, 'owned_hotel', None)
    if not hotel:
        return JsonResponse({
            'has_hotel': False,
            'total_bookings': 0,
            'total_revenue': 0,
            'recent_bookings': [],
            'rooms_count': 0
        })

    bookings = Booking.objects.filter(hotel=hotel)
    
    total_revenue = bookings.filter(status=Booking.STATUS_COMPLETED).aggregate(Sum('total'))['total__sum'] or 0
    total_bookings = bookings.count()
    rooms_count = hotel.room_types.count()
    
    recent_bookings = [b.to_summary() for b in bookings.order_by('-created_at')[:5]]
    
    return JsonResponse({
        'has_hotel': True,
        'hotel_name': hotel.name,
        'total_bookings': total_bookings,
        'total_revenue': total_revenue,
        'recent_bookings': recent_bookings,
        'rooms_count': rooms_count
    })


@csrf_exempt
@require_http_methods(['GET', 'POST', 'PUT'])
@vendor_required
def manage_hotel(request, user):
    hotel = getattr(user, 'owned_hotel', None)
    
    if request.method == 'GET':
        if not hotel:
            return JsonResponse({'hotel': None})
        
        return JsonResponse({'hotel': {
            'id': hotel.id,
            'name': hotel.name,
            'province': hotel.province,
            'address': hotel.address,
            'price_per_night': hotel.price_per_night,
            'rating': hotel.rating,
            'amenities': hotel.amenities,
            'thumbnail': hotel.thumbnail,
            'description': hotel.description,
        }})
        
    try:
        payload = _parse_json_body(request)
    except ValueError as e:
        return _json_error(str(e))
        
    if request.method == 'POST':
        if hotel:
            return _json_error('You already own a hotel.', status=400)
            
        hotel = Hotel.objects.create(
            owner=user,
            name=payload.get('name', ''),
            province=payload.get('province', ''),
            address=payload.get('address', ''),
            price_per_night=payload.get('price_per_night', 0),
            amenities=payload.get('amenities', []),
            thumbnail=payload.get('thumbnail', ''),
            description=payload.get('description', ''),
        )
        return JsonResponse({'message': 'Hotel created.', 'id': hotel.id})
        
    if request.method == 'PUT':
        if not hotel:
            return _json_error('Hotel not found.', status=404)
            
        hotel.name = payload.get('name', hotel.name)
        hotel.province = payload.get('province', hotel.province)
        hotel.address = payload.get('address', hotel.address)
        hotel.price_per_night = payload.get('price_per_night', hotel.price_per_night)
        hotel.amenities = payload.get('amenities', hotel.amenities)
        hotel.thumbnail = payload.get('thumbnail', hotel.thumbnail)
        hotel.description = payload.get('description', hotel.description)
        hotel.save()
        return JsonResponse({'message': 'Hotel updated.'})


@csrf_exempt
@require_http_methods(['GET', 'POST'])
@vendor_required
def manage_rooms(request, user):
    hotel = getattr(user, 'owned_hotel', None)
    if not hotel:
        return _json_error('Hotel not found.', status=404)
        
    if request.method == 'GET':
        rooms = hotel.room_types.all()
        return JsonResponse({'rooms': [{
            'id': r.id,
            'name': r.name,
            'price': r.price,
            'capacity': r.capacity,
            'available_rooms': r.available_rooms,
            'features': r.features
        } for r in rooms]})
        
    try:
        payload = _parse_json_body(request)
    except ValueError as e:
        return _json_error(str(e))
        
    # POST to create new room
    room = RoomType.objects.create(
        hotel=hotel,
        name=payload.get('name', 'New Room'),
        price=payload.get('price', 0),
        capacity=payload.get('capacity', 2),
        available_rooms=payload.get('available_rooms', 1),
        features=payload.get('features', [])
    )
    return JsonResponse({'message': 'Room created.', 'id': room.id})


@csrf_exempt
@require_http_methods(['PUT', 'DELETE'])
@vendor_required
def manage_room_detail(request, user, room_id: int):
    hotel = getattr(user, 'owned_hotel', None)
    if not hotel:
        return _json_error('Hotel not found.', status=404)
        
    room = get_object_or_404(RoomType, id=room_id, hotel=hotel)
    
    if request.method == 'DELETE':
        room.delete()
        return JsonResponse({'message': 'Room deleted.'})
        
    try:
        payload = _parse_json_body(request)
    except ValueError as e:
        return _json_error(str(e))
        
    room.name = payload.get('name', room.name)
    room.price = payload.get('price', room.price)
    room.capacity = payload.get('capacity', room.capacity)
    room.available_rooms = payload.get('available_rooms', room.available_rooms)
    room.features = payload.get('features', room.features)
    room.save()
    
    return JsonResponse({'message': 'Room updated.'})


@csrf_exempt
@require_http_methods(['GET'])
@vendor_required
def list_bookings(request, user):
    hotel = getattr(user, 'owned_hotel', None)
    if not hotel:
        return JsonResponse({'bookings': []})
        
    bookings = Booking.objects.filter(hotel=hotel).order_by('-created_at')
    return JsonResponse({'bookings': [b.to_summary() for b in bookings]})


@csrf_exempt
@require_http_methods(['PUT'])
@vendor_required
def update_booking_status(request, user, booking_id: str):
    hotel = getattr(user, 'owned_hotel', None)
    if not hotel:
        return _json_error('Hotel not found.', status=404)
        
    booking = get_object_or_404(Booking, booking_id=booking_id, hotel=hotel)
    
    try:
        payload = _parse_json_body(request)
    except ValueError as e:
        return _json_error(str(e))
        
    new_status = payload.get('status')
    if new_status not in dict(Booking.STATUS_CHOICES):
        return _json_error('Invalid status.', status=400)
        
    booking.status = new_status
    booking.save()
    
    return JsonResponse({'message': 'Booking status updated.', 'status': booking.status})
