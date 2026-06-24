import type { UserProfile } from "./user";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
  password_confirm: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordConfirmRequest {
  uid: string;
  token: string;
  new_password: string;
}

export interface AuthTokens {
  access: string;
  refresh?: string;
}

export interface AuthResponse {
  user: UserProfile;
  tokens: AuthTokens;
}

export interface ForgotPasswordResponse {
  detail: string;
}
