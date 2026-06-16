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
        if User.objects.filter(username=normalized_email).exists():
            raise ValueError('An account with this email already exists.')

        user = User.objects.create_user(
            username=normalized_email,
            email=normalized_email,
            password=password,
        )
        Profile.objects.update_or_create(
            user=user,
            defaults={'full_name': full_name.strip()},
        )

        return self._issue_tokens(user)

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
        if User.objects.filter(username=normalized_email).exists():
            return 'Password reset instructions have been sent.'

        return 'If the email exists, password reset instructions have been sent.'

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