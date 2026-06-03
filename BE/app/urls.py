from django.urls import path

from app import views


urlpatterns = [
    path('health/', views.health_check, name='api-health'),
    path('hotels/', views.hotel_list, name='api-hotels'),
    path('hotels/<int:hotel_id>/', views.hotel_detail, name='api-hotel-detail'),
    path('hotels/<int:hotel_id>/availability/', views.hotel_availability, name='api-hotel-availability'),
    path('provinces/', views.province_list, name='api-provinces'),
    path('auth/login/', views.login, name='api-auth-login'),
    path('auth/register/', views.register, name='api-auth-register'),
    path('auth/password-reset/', views.forgot_password, name='api-auth-password-reset'),
    path('auth/logout/', views.logout, name='api-auth-logout'),
    path('users/me/', views.current_user, name='api-users-me'),
    path('bookings/', views.create_booking, name='api-bookings-create'),
    path('bookings/my/', views.my_bookings, name='api-bookings-my'),
    path('bookings/<str:booking_id>/', views.booking_detail, name='api-booking-detail'),
]