from django.urls import path

from app import views


urlpatterns = [
    path('health/', views.health_check, name='api-health'),
    path('hotels/', views.hotel_list, name='api-hotels'),
    path('provinces/', views.province_list, name='api-provinces'),
]