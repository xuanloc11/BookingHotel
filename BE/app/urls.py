from django.urls import path

from app import views
from app import views_vendor


urlpatterns = [
    path('health/', views.health_check, name='api-health'),
    path('hotels/', views.hotel_list, name='api-hotels'),
    path('hotels/<int:hotel_id>/', views.hotel_detail, name='api-hotel-detail'),
    path('hotels/<int:hotel_id>/availability/', views.hotel_availability, name='api-hotel-availability'),
    path('provinces/', views.province_list, name='api-provinces'),
    path('auth/login/', views.login, name='api-auth-login'),
    path('auth/login', views.login),
    path('auth/register/', views.register, name='api-auth-register'),
    path('auth/register', views.register),
    path('auth/password-reset/', views.forgot_password, name='api-auth-password-reset'),
    path('auth/password-reset', views.forgot_password),
    path('auth/logout/', views.logout, name='api-auth-logout'),
    path('auth/logout', views.logout),
    path('users/me/', views.current_user, name='api-users-me'),
    path('users/me', views.current_user),
    path('bookings/', views.create_booking, name='api-bookings-create'),
    path('bookings', views.create_booking),
    path('bookings/my/', views.my_bookings, name='api-bookings-my'),
    path('bookings/my', views.my_bookings),
    path('bookings/<str:booking_id>/', views.booking_detail, name='api-booking-detail'),
    path('vendor/dashboard/', views_vendor.dashboard_stats, name='api-vendor-dashboard'),
    path('vendor/hotels/', views_vendor.manage_hotel, name='api-vendor-hotels'),
    path('vendor/hotels/rooms/', views_vendor.manage_rooms, name='api-vendor-rooms'),
    path('vendor/hotels/rooms/<int:room_id>/', views_vendor.manage_room_detail, name='api-vendor-room-detail'),
    path('vendor/bookings/', views_vendor.list_bookings, name='api-vendor-bookings'),
    path('vendor/bookings/<str:booking_id>/', views_vendor.update_booking_status, name='api-vendor-booking-status'),
]