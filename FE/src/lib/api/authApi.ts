import { fetchBackendJson } from "./backend";
import type {
  AuthResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  RegisterRequest,
} from "@/types/auth";

export const AUTH_ACCESS_TOKEN_COOKIE = "booking_access_token";
const ACCESS_TOKEN_STORAGE_KEY = "booking.accessToken";
const REFRESH_TOKEN_STORAGE_KEY = "booking.refreshToken";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function setCookie(name: string, value: string, maxAgeSeconds: number): void {
  if (!isBrowser()) {
    return;
  }

  document.cookie = `${name}=${encodeURIComponent(
    value,
  )}; path=/; max-age=${maxAgeSeconds}; samesite=lax`;
}

function clearCookie(name: string): void {
  if (!isBrowser()) {
    return;
  }

  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
}

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  return fetchBackendJson<AuthResponse>("/auth/login/", {
    method: "POST",
    body: payload,
  });
}

export async function register(payload: RegisterRequest): Promise<AuthResponse> {
  return fetchBackendJson<AuthResponse>("/auth/register/", {
    method: "POST",
    body: payload,
  });
}

export async function forgotPassword(
  payload: ForgotPasswordRequest,
): Promise<ForgotPasswordResponse> {
  return fetchBackendJson<ForgotPasswordResponse>("/auth/password-reset/", {
    method: "POST",
    body: payload,
  });
}

export async function logout(accessToken?: string): Promise<void> {
  try {
    await fetchBackendJson<void>("/auth/logout/", {
      method: "POST",
      authToken: accessToken ?? readStoredAccessToken() ?? undefined,
    });
  } finally {
    clearAuthSession();
  }
}

export function persistAuthSession(response: AuthResponse): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, response.tokens.access);
  setCookie(AUTH_ACCESS_TOKEN_COOKIE, response.tokens.access, 60 * 60 * 24);

  if (response.tokens.refresh) {
    window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, response.tokens.refresh);
  }
}

export function readStoredAccessToken(): string | null {
  if (!isBrowser()) {
    return null;
  }

  return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function clearAuthSession(): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  clearCookie(AUTH_ACCESS_TOKEN_COOKIE);
}
