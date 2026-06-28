import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'BE.settings')
django.setup()

from django.contrib.auth import get_user_model
from app.models import WithdrawalRequest
from app.views_admin import _process_withdrawal

User = get_user_model()
w = WithdrawalRequest.objects.first()
u = User.objects.first()

try:
    _process_withdrawal(w, 'approved', u)
    print("Success")
except Exception as e:
    import traceback
    traceback.print_exc()
