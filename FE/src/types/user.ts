export interface UserProfile {
  id: number | string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  date_joined?: string;
}

export interface UpdateUserProfileRequest {
  full_name?: string;
  phone?: string;
}
