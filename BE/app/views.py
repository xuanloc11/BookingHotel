from __future__ import annotations

import json

from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from django.http import HttpRequest, JsonResponse, HttpResponse
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.views.decorators.http import require_GET, require_http_methods

from app.models import Profile
from app.services.auth_service import AuthService
from app.services.booking_service import BookingService
from app.services.hotel_service import HotelService


hotel_service = HotelService()
auth_service = AuthService()
booking_service = BookingService()


def _json_error(message: str, status: int = 400, details: object | None = None) -> JsonResponse:
    payload = {'detail': message}
    if details is not None:
        payload['details'] = details
    return JsonResponse(payload, status=status)

from django_ratelimit.decorators import ratelimit

def check_ratelimit(request) -> JsonResponse | None:
    if getattr(request, 'limited', False):
        return _json_error('Bạn đã thử quá nhiều lần. Vui lòng đợi một lát trước khi thử lại.', status=429)
    return None


def _parse_json_body(request: HttpRequest) -> dict:
    if not request.body:
        return {}

    try:
        return json.loads(request.body.decode('utf-8'))
    except json.JSONDecodeError as error:
        raise ValueError('Invalid JSON payload.') from error


def _get_access_token(request: HttpRequest) -> str | None:
    auth_header = request.headers.get('Authorization', '')
    if auth_header.startswith('Bearer '):
        return auth_header.removeprefix('Bearer ').strip()

    cookie_token = request.COOKIES.get('booking_access_token')
    if cookie_token:
        return cookie_token

    return None


def _get_authenticated_user(request: HttpRequest):
    if request.user.is_authenticated:
        return request.user

    access_token = _get_access_token(request)
    if not access_token:
        return None

    return auth_service.authenticate_token(access_token)


def _serialize_user(user) -> dict:
    profile, _ = Profile.objects.get_or_create(user=user, defaults={'full_name': user.get_full_name() or user.email})
    return {
        'id': user.id,
        'email': user.email,
        'full_name': profile.full_name,
        'phone': profile.phone,
        'role': 'admin' if user.is_superuser else profile.role,
        'avatar_url': profile.avatar_url,
        'date_joined': user.date_joined.isoformat() if user.date_joined else None,
    }


@require_GET
def health_check(request):
	return JsonResponse({'status': 'ok', 'service': 'booking-hotel-be'})


@ensure_csrf_cookie
@require_GET
def get_csrf_token(request):
	return JsonResponse({'status': 'ok'})


@require_GET
def hotel_list(request):
	limit = request.GET.get('limit')
	limit_value = int(limit) if limit and limit.isdigit() else None
	price_min = int(request.GET['priceMin']) if request.GET.get('priceMin', '').isdigit() else None
	price_max = int(request.GET['priceMax']) if request.GET.get('priceMax', '').isdigit() else None
	star_rating_str = request.GET.get('starRating', '')
	star_rating = float(star_rating_str) if star_rating_str.replace('.', '', 1).isdigit() else None
	stars_str = request.GET.get('stars', '')
	stars = int(stars_str) if stars_str.isdigit() else None
	location = request.GET.get('location') or None
	amenities = request.GET.getlist('amenities')
	sort_by = request.GET.get('sortBy') or None
	check_in = request.GET.get('checkIn') or None
	check_out = request.GET.get('checkOut') or None
	rooms_str = request.GET.get('rooms', '')
	rooms = int(rooms_str) if rooms_str.isdigit() else 1
	hotels = hotel_service.list_hotels(
		limit=limit_value,
		location=location,
		price_min=price_min,
		price_max=price_max,
		star_rating=star_rating,
		stars=stars,
		amenities=amenities,
		sort_by=sort_by,
		check_in=check_in,
		check_out=check_out,
		rooms_needed=rooms,
	)
	return JsonResponse({'results': hotels})


@require_GET
def hotel_detail(request, hotel_id: str):
	hotel = hotel_service.get_hotel_details(hotel_id)
	if not hotel:
		return _json_error('Hotel not found.', status=404)
	return JsonResponse(hotel)


@require_GET
def hotel_availability(request, hotel_id: str):
	room_type_id = request.GET.get('room_type_id')
	room_type_id = int(room_type_id) if room_type_id and room_type_id.isdigit() else None
	user = _get_authenticated_user(request)
	user_role = 'member' if user and user.is_authenticated else 'guest'
	availability = hotel_service.get_hotel_availability(hotel_id, room_type_id=room_type_id, user_role=user_role)
	if not availability and hotel_service.get_hotel_details(hotel_id) is None:
		return _json_error('Hotel not found.', status=404)
	return JsonResponse({'results': availability})


@require_GET
def province_list(request):
	provinces = hotel_service.list_provinces()
	return JsonResponse({'results': provinces})


@ratelimit(key='ip', rate='5/m', block=False)
@csrf_exempt
@require_http_methods(['POST'])
def register(request):
	limit_resp = check_ratelimit(request)
	if limit_resp: return limit_resp

	try:
		payload = _parse_json_body(request)
		result = auth_service.register(
			full_name=payload.get('full_name', ''),
			email=payload.get('email', ''),
			password=payload.get('password', ''),
			password_confirm=payload.get('password_confirm', ''),
		)
	except ValueError as error:
		return _json_error(str(error))

	return JsonResponse({'message': 'Vui lòng kiểm tra email để xác nhận tài khoản.'}, status=201)

@csrf_exempt
@require_http_methods(['POST'])
def verify_email(request):
	try:
		payload = _parse_json_body(request)
		uidb64 = payload.get('uid')
		token = payload.get('token')

		from django.utils.http import urlsafe_base64_decode
		from django.contrib.auth import get_user_model
		from django.contrib.auth.tokens import default_token_generator

		User = get_user_model()
		try:
			uid = urlsafe_base64_decode(uidb64).decode()
			user = User.objects.get(pk=uid)
		except (TypeError, ValueError, OverflowError, User.DoesNotExist):
			user = None

		if user is not None and default_token_generator.check_token(user, token):
			user.is_active = True
			user.save()
			return JsonResponse({'message': 'Xác nhận email thành công. Bạn có thể đăng nhập.'})
		else:
			return _json_error('Link xác nhận không hợp lệ hoặc đã hết hạn.', status=400)
	except Exception as e:
		return _json_error(str(e))


@ratelimit(key='ip', rate='5/m', block=False)
@csrf_exempt
@require_http_methods(['POST'])
def login(request):
	limit_resp = check_ratelimit(request)
	if limit_resp: return limit_resp

	try:
		payload = _parse_json_body(request)
		result = auth_service.login(
			email=payload.get('email', ''),
			password=payload.get('password', ''),
		)
	except ValueError as error:
		return _json_error(str(error), status=401)

	auth_login(request, result.user)
	response = JsonResponse({'user': _serialize_user(result.user), 'tokens': {'access': result.access_token, 'refresh': result.refresh_token}})
	response.set_cookie('booking_access_token', result.access_token, max_age=60 * 60 * 24, samesite='Lax')
	return response


@ratelimit(key='ip', rate='3/m', block=False)
@csrf_exempt
@require_http_methods(['POST'])
def forgot_password(request):
	limit_resp = check_ratelimit(request)
	if limit_resp: return limit_resp

	try:
		payload = _parse_json_body(request)
	except ValueError as error:
		return _json_error(str(error))

	return JsonResponse({'detail': auth_service.reset_password(payload.get('email', ''))})


@ratelimit(key='ip', rate='5/m', block=False)
@csrf_exempt
@require_http_methods(['POST'])
def reset_password_confirm(request):
	limit_resp = check_ratelimit(request)
	if limit_resp: return limit_resp

	try:
		payload = _parse_json_body(request)
	except ValueError as error:
		return _json_error(str(error))

	uidb64 = payload.get('uid')
	token = payload.get('token')
	new_password = payload.get('new_password')

	if not uidb64 or not token or not new_password:
		return _json_error('Thiếu thông tin yêu cầu.', status=400)

	success = auth_service.confirm_reset_password(uidb64, token, new_password)
	if success:
		return JsonResponse({'message': 'Đặt lại mật khẩu thành công.'})
	return _json_error('Đường dẫn không hợp lệ hoặc đã hết hạn.', status=400)


@csrf_exempt
@require_http_methods(['POST'])
def logout(request):
	user = _get_authenticated_user(request)
	auth_service.logout(user=user, access_token=_get_access_token(request))
	auth_logout(request)
	response = HttpResponse(status=204)
	response.delete_cookie('booking_access_token')
	return response


@csrf_exempt
@require_http_methods(['GET', 'PATCH'])
def current_user(request):
	user = _get_authenticated_user(request)
	if not user:
		return _json_error('Authentication required.', status=401)

	profile, _ = Profile.objects.get_or_create(user=user, defaults={'full_name': user.get_full_name() or user.email})

	if request.method == 'GET':
		return JsonResponse(_serialize_user(user))

	try:
		payload = _parse_json_body(request)
	except ValueError as error:
		return _json_error(str(error))

	full_name = payload.get('full_name')
	phone = payload.get('phone')
	updated_fields = []
	if full_name is not None:
		profile.full_name = full_name.strip()
		updated_fields.append('full_name')
	if phone is not None:
		profile.phone = phone.strip()
		updated_fields.append('phone')
	if updated_fields:
		profile.save(update_fields=updated_fields)

	return JsonResponse(_serialize_user(user))


@csrf_exempt
@require_http_methods(['POST'])
def create_booking(request):
	try:
		payload = _parse_json_body(request)
		result = booking_service.create_booking(payload, user=_get_authenticated_user(request))
	except ValueError as error:
		return _json_error(str(error))
	except Exception as e:
		import traceback
		return _json_error(f"Internal Error: {str(e)}\n{traceback.format_exc()}", status=500)

	return JsonResponse(result.payload, status=201)


@csrf_exempt
@require_http_methods(['POST'])
def create_room_hold(request):
	try:
		payload = _parse_json_body(request)
		result = booking_service.create_room_hold(payload)
	except ValueError as error:
		return _json_error(str(error))

	return JsonResponse(result, status=201)


@require_GET
def my_bookings(request):
	user = _get_authenticated_user(request)
	if not user:
		return _json_error('Authentication required.', status=401)

	return JsonResponse({'results': booking_service.list_user_bookings(user)})


@require_GET
def booking_detail(request, booking_id: str):
	user = _get_authenticated_user(request)
	if not user:
		return _json_error('Authentication required.', status=401)

	booking = booking_service.get_booking(booking_id, user)
	if not booking:
		return _json_error('Booking not found.', status=404)

	return JsonResponse(booking)

@require_GET
def booking_guest_detail(request):
	booking_id = request.GET.get('booking_id')
	contact_info = request.GET.get('contact')
	
	if not booking_id or not contact_info:
		return _json_error('Vui lòng cung cấp mã đơn hàng và email hoặc số điện thoại.', status=400)
		
	booking = booking_service.get_guest_booking(booking_id, contact_info)
	if not booking:
		return _json_error('Không tìm thấy đơn hàng hoặc thông tin liên hệ không khớp.', status=404)
		
	return JsonResponse(booking)

@csrf_exempt
@require_http_methods(['POST'])
def cancel_booking(request, booking_id: str):
	user = _get_authenticated_user(request)
	if not user:
		return _json_error('Authentication required.', status=401)
	
	try:
		result = booking_service.cancel_booking(booking_id, user)
		return JsonResponse(result)
	except ValueError as error:
		return _json_error(str(error))

@csrf_exempt
@require_http_methods(['POST'])
def newsletter_subscribe(request: HttpRequest) -> HttpResponse:
    try:
        payload = _parse_json_body(request)
        email = payload.get('email')
        
        if not email:
            return _json_error('Vui lòng cung cấp email.', status=400)
            
        from app.models import NewsletterSubscription
        sub, created = NewsletterSubscription.objects.get_or_create(email=email)
        
        if not created and not sub.is_active:
            sub.is_active = True
            sub.save()
            
        return JsonResponse({'message': 'Đăng ký nhận bản tin thành công!'})
    except Exception as e:
        return _json_error(str(e), status=500)
