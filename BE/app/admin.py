from django.contrib import admin

from app.models import AuthToken, Booking, Profile


admin.site.register(Profile)
admin.site.register(AuthToken)
admin.site.register(Booking)
