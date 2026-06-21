import json
from datetime import datetime, timedelta

from django.http import HttpRequest, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.shortcuts import get_object_or_404
from django.db.models import Sum, Count, Q
from django.db.models.functions import TruncMonth

from app.models import Profile, Hotel, RoomType, Booking, Review, Promotion, Transaction, VendorSetting
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
    
    six_months_ago = datetime.now() - timedelta(days=180)
    monthly_stats = bookings.filter(created_at__gte=six_months_ago)\
        .annotate(month=TruncMonth('created_at'))\
        .values('month')\
        .annotate(
            revenue=Sum('total', filter=Q(status=Booking.STATUS_COMPLETED)),
            bookings_count=Count('id')
        )\
        .order_by('month')

    chart_data = []
    for stat in monthly_stats:
        if stat['month']:
            chart_data.append({
                'name': stat['month'].strftime('%m/%Y'),
                'revenue': stat['revenue'] or 0,
                'bookings': stat['bookings_count']
            })
    
    return JsonResponse({
        'has_hotel': True,
        'hotel_name': hotel.name,
        'total_bookings': total_bookings,
        'total_revenue': total_revenue,
        'recent_bookings': recent_bookings,
        'rooms_count': rooms_count,
        'chart_data': chart_data
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


# --- EXTRANET FEATURES ---

@csrf_exempt
@require_http_methods(['GET'])
@vendor_required
def get_reviews(request, user):
    hotel = getattr(user, 'owned_hotel', None)
    if not hotel:
        return JsonResponse({'reviews': []})
        
    reviews = Review.objects.filter(hotel=hotel).order_by('-created_at')
    return JsonResponse({'reviews': [{
        'id': r.id,
        'customer_name': r.customer_name,
        'rating': r.rating,
        'content': r.content,
        'reply': r.reply,
        'status': r.status,
        'created_at': r.created_at.isoformat()
    } for r in reviews]})

@csrf_exempt
@require_http_methods(['POST'])
@vendor_required
def reply_review(request, user, review_id: int):
    hotel = getattr(user, 'owned_hotel', None)
    if not hotel:
        return _json_error('Hotel not found.', status=404)
        
    review = get_object_or_404(Review, id=review_id, hotel=hotel)
    
    try:
        payload = _parse_json_body(request)
    except ValueError as e:
        return _json_error(str(e))
        
    reply_content = payload.get('reply', '').strip()
    if not reply_content:
        return _json_error('Reply content cannot be empty.', status=400)
        
    review.reply = reply_content
    review.status = Review.STATUS_REPLIED
    review.save()
    
    return JsonResponse({'message': 'Reply submitted successfully.'})

@csrf_exempt
@require_http_methods(['GET', 'POST'])
@vendor_required
def manage_promotions(request, user):
    hotel = getattr(user, 'owned_hotel', None)
    if not hotel:
        return _json_error('Hotel not found.', status=404)
        
    if request.method == 'GET':
        promotions = Promotion.objects.filter(hotel=hotel).order_by('-created_at')
        return JsonResponse({'promotions': [{
            'id': p.id,
            'code': p.code,
            'name': p.name,
            'discount_type': p.discount_type,
            'discount_value': p.discount_value,
            'start_date': p.start_date.isoformat() if p.start_date else None,
            'end_date': p.end_date.isoformat() if p.end_date else None,
            'usage_count': p.usage_count,
            'is_active': p.is_active,
        } for p in promotions]})
        
    try:
        payload = _parse_json_body(request)
    except ValueError as e:
        return _json_error(str(e))
        
    promo = Promotion.objects.create(
        hotel=hotel,
        code=payload.get('code', ''),
        name=payload.get('name', ''),
        discount_type=payload.get('discount_type', Promotion.TYPE_PERCENTAGE),
        discount_value=payload.get('discount_value', 0),
        start_date=payload.get('start_date'),
        end_date=payload.get('end_date'),
        is_active=payload.get('is_active', True)
    )
    return JsonResponse({'message': 'Promotion created.', 'id': promo.id})

@csrf_exempt
@require_http_methods(['DELETE'])
@vendor_required
def delete_promotion(request, user, promo_id: int):
    hotel = getattr(user, 'owned_hotel', None)
    if not hotel:
        return _json_error('Hotel not found.', status=404)
        
    promo = get_object_or_404(Promotion, id=promo_id, hotel=hotel)
    promo.delete()
    return JsonResponse({'message': 'Promotion deleted.'})

@csrf_exempt
@require_http_methods(['GET'])
@vendor_required
def get_finance(request, user):
    hotel = getattr(user, 'owned_hotel', None)
    if not hotel:
        return JsonResponse({'balance': 0, 'total_revenue': 0, 'transactions': []})
        
    transactions = Transaction.objects.filter(hotel=hotel).order_by('-created_at')
    
    balance = transactions.filter(type=Transaction.TYPE_REVENUE, status=Transaction.STATUS_COMPLETED).aggregate(Sum('net_amount'))['net_amount__sum'] or 0
    payouts = transactions.filter(type=Transaction.TYPE_PAYOUT).aggregate(Sum('amount'))['amount__sum'] or 0
    available_balance = balance - payouts
    
    total_revenue = transactions.filter(type=Transaction.TYPE_REVENUE).aggregate(Sum('amount'))['amount__sum'] or 0
    
    return JsonResponse({
        'available_balance': available_balance,
        'total_revenue': total_revenue,
        'transactions': [{
            'id': t.id,
            'transaction_id': t.transaction_id,
            'type': t.type,
            'amount': t.amount,
            'commission_fee': t.commission_fee,
            'net_amount': t.net_amount,
            'description': t.description,
            'status': t.status,
            'created_at': t.created_at.isoformat()
        } for t in transactions]
    })

@csrf_exempt
@require_http_methods(['GET', 'PUT'])
@vendor_required
def manage_settings(request, user):
    setting, created = VendorSetting.objects.get_or_create(user=user)
    
    if request.method == 'GET':
        return JsonResponse({'settings': {
            'company_name': setting.company_name,
            'tax_id': setting.tax_id,
            'bank_name': setting.bank_name,
            'bank_branch': setting.bank_branch,
            'account_name': setting.account_name,
            'account_number': setting.account_number,
        }})
        
    try:
        payload = _parse_json_body(request)
    except ValueError as e:
        return _json_error(str(e))
        
    setting.company_name = payload.get('company_name', setting.company_name)
    setting.tax_id = payload.get('tax_id', setting.tax_id)
    setting.bank_name = payload.get('bank_name', setting.bank_name)
    setting.bank_branch = payload.get('bank_branch', setting.bank_branch)
    setting.account_name = payload.get('account_name', setting.account_name)
    setting.account_number = payload.get('account_number', setting.account_number)
    setting.save()
    
    return JsonResponse({'message': 'Settings updated successfully.'})
