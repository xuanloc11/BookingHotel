from __future__ import annotations

from dataclasses import dataclass
from secrets import token_urlsafe

from django.contrib.auth import authenticate, get_user_model

from app.models import AuthToken, Profile


User = get_user_model()


@dataclass
class AuthResult:
    user: User
    access_token: str
    refresh_token: str


class AuthService:
    def register(self, full_name: str, email: str, password: str, password_confirm: str) -> AuthResult:
        if password != password_confirm:
            raise ValueError('Password confirmation does not match.')

        normalized_email = email.strip().lower()
        existing_user = User.objects.filter(username=normalized_email).first()
        if existing_user:
            if not existing_user.is_active:
                raise ValueError('Tài khoản này đã được đăng ký nhưng chưa xác nhận email. Vui lòng kiểm tra email hoặc dùng email khác để đăng ký.')
            raise ValueError('Email này đã được sử dụng.')

        user = User.objects.create_user(
            username=normalized_email,
            email=normalized_email,
            password=password,
            is_active=False,
        )
        Profile.objects.update_or_create(
            user=user,
            defaults={'full_name': full_name.strip()},
        )

        from django.contrib.auth.tokens import default_token_generator
        from app.services.email_service import EmailService

        token = default_token_generator.make_token(user)
        EmailService.send_verification_email(user, token)

        return AuthResult(user=user, access_token="", refresh_token="")

    def login(self, email: str, password: str) -> AuthResult:
        normalized_email = email.strip().lower()
        
        try:
            db_user = User.objects.filter(email=normalized_email).first()
            username = db_user.username if db_user else normalized_email
        except Exception:
            username = normalized_email

        user = authenticate(username=username, password=password)

        if not user:
            raise ValueError('Invalid email or password.')

        Profile.objects.get_or_create(user=user, defaults={'full_name': user.get_full_name() or user.email})
        return self._issue_tokens(user)

    def reset_password(self, email: str) -> str:
        normalized_email = email.strip().lower()
        user = User.objects.filter(username=normalized_email).first()
        if user:
            from django.contrib.auth.tokens import default_token_generator
            from app.services.email_service import EmailService

            token = default_token_generator.make_token(user)
            EmailService.send_password_reset_email(user, token)
            return 'Đã gửi hướng dẫn đặt lại mật khẩu vào email của bạn.'

        return 'Nếu email tồn tại, hướng dẫn đặt lại mật khẩu đã được gửi.'

    def confirm_reset_password(self, uidb64: str, token: str, new_password: str) -> bool:
        from django.utils.http import urlsafe_base64_decode
        from django.utils.encoding import force_str
        from django.contrib.auth.tokens import default_token_generator

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            user.set_password(new_password)
            user.save()
            return True
        return False

    def logout(self, user: User | None = None, access_token: str | None = None) -> None:
        if access_token:
            AuthToken.objects.filter(access_token=access_token).delete()

        if user and user.is_authenticated:
            AuthToken.objects.filter(user=user).delete()

    def authenticate_token(self, access_token: str):
        token = AuthToken.objects.select_related('user').filter(access_token=access_token).first()
        if not token:
            return None

        token.touch()
        return token.user

    def _issue_tokens(self, user: User) -> AuthResult:
        token, _ = AuthToken.objects.update_or_create(
            user=user,
            defaults={
                'access_token': token_urlsafe(32),
                'refresh_token': token_urlsafe(32),
            },
        )
        return AuthResult(
            user=user,
            access_token=token.access_token,
            refresh_token=token.refresh_token,
        )