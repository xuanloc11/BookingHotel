from django.http import JsonResponse
from django.views.decorators.http import require_GET

from app.services.hotel_service import HotelService


hotel_service = HotelService()


@require_GET
def health_check(request):
	return JsonResponse({'status': 'ok', 'service': 'booking-hotel-be'})


@require_GET
def hotel_list(request):
	limit = request.GET.get('limit')
	limit_value = int(limit) if limit and limit.isdigit() else None
	hotels = hotel_service.list_hotels(limit=limit_value)
	return JsonResponse({'results': hotels})


@require_GET
def province_list(request):
	provinces = hotel_service.list_provinces()
	return JsonResponse({'results': provinces})
