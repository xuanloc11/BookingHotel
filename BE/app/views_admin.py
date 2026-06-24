import json
from datetime import datetime, timedelta

from django.http import HttpRequest, JsonResponse
from django.views.decorators.http import require_http_methods
from django.db.models import Sum, Count, Q
from django.db.models.functions import TruncMonth
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

from app.models import Profile, Hotel, Booking
from app.views import _get_authenticated_user, _json_error, _parse_json_body

User = get_user_model()


def _is_admin(user) -> bool:
    if not user:
        return False
    if user.is_superuser:
        return True
    profile = Profile.objects.filter(user=user).first()
    return profile and profile.role == Profile.ROLE_ADMIN


def admin_required(view_func):
    def wrapper(request: HttpRequest, *args, **kwargs):
        user = _get_authenticated_user(request)
        if not user or not _is_admin(user):
            return _json_error('Admin authentication required.', status=403)
        return view_func(request, user, *args, **kwargs)
    return wrapper


@require_http_methods(['GET'])
@admin_required
def dashboard_stats(request, user):
    total_users = User.objects.count()
    total_hotels = Hotel.objects.count()
    total_bookings = Booking.objects.count()
    total_revenue = Booking.objects.filter(status=Booking.STATUS_COMPLETED).aggregate(Sum('total'))['total__sum'] or 0

    recent_bookings = [b.to_summary() for b in Booking.objects.order_by('-created_at')[:5]]

    six_months_ago = datetime.now() - timedelta(days=180)
    monthly_stats = Booking.objects.filter(created_at__gte=six_months_ago)\
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
        'total_users': total_users,
        'total_hotels': total_hotels,
        'total_bookings': total_bookings,
        'total_revenue': total_revenue,
        'recent_bookings': recent_bookings,
        'chart_data': chart_data,
    })


@require_http_methods(['GET', 'POST'])
@admin_required
def list_users(request, user):
    if request.method == 'GET':
        users = User.objects.all().order_by('-date_joined')
        user_list = []
        for u in users:
            profile = getattr(u, 'profile', None)
            user_list.append({
                'id': u.id,
                'email': u.email,
                'full_name': profile.full_name if profile else (u.get_full_name() or u.email),
                'role': profile.role if profile else ('admin' if u.is_superuser else 'customer'),
                'date_joined': u.date_joined.isoformat() if u.date_joined else None,
                'is_superuser': u.is_superuser,
                'is_active': u.is_active,
            })
        return JsonResponse({'users': user_list})

    if request.method == 'POST':
        try:
            payload = _parse_json_body(request)
        except ValueError as e:
            return _json_error(str(e))
            
        email = payload.get('email')
        password = payload.get('password')
        full_name = payload.get('full_name')
        role = payload.get('role', Profile.ROLE_CUSTOMER)
        
        if not email or not password or not full_name:
            return _json_error('Email, password and full_name are required.', status=400)
            
        if User.objects.filter(email=email).exists():
            return _json_error('A user with that email already exists.', status=400)
            
        new_user = User.objects.create_user(username=email, email=email, password=password)
        if role == Profile.ROLE_ADMIN:
            new_user.is_superuser = True
            new_user.save()
            
        Profile.objects.create(user=new_user, full_name=full_name, role=role)
        return JsonResponse({'message': 'User created successfully.', 'id': new_user.id})


@require_http_methods(['GET'])
@admin_required
def list_hotels(request, user):
    hotels = Hotel.objects.all().order_by('-created_at')
    hotel_list = []
    for h in hotels:
        owner_name = getattr(h.owner.profile, 'full_name', h.owner.email) if h.owner and hasattr(h.owner, 'profile') else 'Unknown'
        hotel_list.append({
            'id': h.id,
            'name': h.name,
            'province': h.province,
            'price_per_night': h.price_per_night,
            'rating': h.rating,
            'owner_name': owner_name,
            'owner_email': h.owner.email if h.owner else '',
            'created_at': h.created_at.isoformat() if h.created_at else None,
        })
    return JsonResponse({'hotels': hotel_list})


@require_http_methods(['PUT', 'DELETE'])
@admin_required
def manage_user(request, user, user_id: int):
    target_user = get_object_or_404(User, id=user_id)
    
    # Prevent admins from deleting or demoting themselves
    if request.method == 'DELETE':
        if target_user.id == user.id:
            return _json_error('You cannot delete your own account.', status=400)
        target_user.delete()
        return JsonResponse({'message': 'User deleted successfully.'})
        
    if request.method == 'PUT':
        try:
            payload = _parse_json_body(request)
        except ValueError as e:
            return _json_error(str(e))
            
        role = payload.get('role')
        is_active = payload.get('is_active')
        email = payload.get('email')
        full_name = payload.get('full_name')
        password = payload.get('password')
        
        if is_active is not None:
            if target_user.id == user.id and not is_active:
                return _json_error('You cannot disable your own account.', status=400)
            target_user.is_active = is_active
            
        if email:
            if email != target_user.email and User.objects.filter(email=email).exists():
                return _json_error('Email is already in use by another account.', status=400)
            target_user.email = email
            target_user.username = email
            
        if password:
            target_user.set_password(password)
            
        target_user.save()
        
        if full_name or role is not None:
            profile, _ = Profile.objects.get_or_create(user=target_user)
            if full_name:
                profile.full_name = full_name
            if role is not None and role in [Profile.ROLE_CUSTOMER, Profile.ROLE_VENDOR, Profile.ROLE_ADMIN]:
                if target_user.id == user.id and role != Profile.ROLE_ADMIN:
                    return _json_error('You cannot demote your own account.', status=400)
                profile.role = role
                if role == Profile.ROLE_ADMIN:
                    target_user.is_superuser = True
                else:
                    target_user.is_superuser = False
                target_user.save()
            profile.save()
            
        return JsonResponse({'message': 'User updated successfully.'})

@require_http_methods(['DELETE'])
@admin_required
def manage_hotel(request, user, hotel_id: int):
    hotel = get_object_or_404(Hotel, id=hotel_id)
    hotel.delete()
    return JsonResponse({'message': 'Hotel deleted successfully.'})

@require_http_methods(['GET'])
@admin_required
def list_bookings(request, user):
    bookings = Booking.objects.all().order_by('-created_at')
    return JsonResponse({'bookings': [b.to_summary() for b in bookings]})

@require_http_methods(['GET'])
@admin_required
def list_approvals(request, user):
    hotels = Hotel.objects.filter(status=Hotel.STATUS_PENDING).order_by('-created_at')
    hotel_list = []
    for h in hotels:
        owner_name = getattr(h.owner.profile, 'full_name', h.owner.email) if h.owner and hasattr(h.owner, 'profile') else 'Unknown'
        setting = getattr(h.owner, 'vendor_setting', None) if h.owner else None
        
        hotel_list.append({
            'id': h.id,
            'name': h.name,
            'owner_name': owner_name,
            'owner_email': h.owner.email if h.owner else '',
            'company_name': setting.company_name if setting else '',
            'tax_id': setting.tax_id if setting else '',
            'created_at': h.created_at.isoformat() if h.created_at else None,
            'status': h.status,
        })
    return JsonResponse({'approvals': hotel_list})

@require_http_methods(['PUT'])
@admin_required
def update_approval_status(request, user, hotel_id: int):
    hotel = get_object_or_404(Hotel, id=hotel_id)
    try:
        payload = _parse_json_body(request)
    except ValueError as e:
        return _json_error(str(e))
        
    status = payload.get('status')
    if status in [Hotel.STATUS_APPROVED, Hotel.STATUS_REJECTED]:
        hotel.status = status
        hotel.save()
        return JsonResponse({'message': f'Hotel status updated to {status}.'})
    return _json_error('Invalid status.', status=400)
