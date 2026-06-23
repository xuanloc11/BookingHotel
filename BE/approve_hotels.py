import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'BE.settings')
django.setup()

from app.models import Hotel

print("--- Approving all Hotels ---")
count = Hotel.objects.update(status=Hotel.STATUS_APPROVED)
print(f"Approved {count} hotels.")

print("\nAll done!")
