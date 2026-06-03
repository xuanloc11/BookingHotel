import { fetchBackendJson } from "./backend";
import type { UpdateUserProfileRequest, UserProfile } from "@/types/user";

interface UserApiOptions {
  authToken?: string;
  headers?: HeadersInit;
}

export async function fetchCurrentUser(
  options: UserApiOptions = {},
): Promise<UserProfile> {
  return fetchBackendJson<UserProfile>("/users/me/", {
    authToken: options.authToken,
    headers: options.headers,
  });
}

export async function updateCurrentUser(
  payload: UpdateUserProfileRequest,
  options: UserApiOptions = {},
): Promise<UserProfile> {
  return fetchBackendJson<UserProfile>("/users/me/", {
    method: "PATCH",
    body: payload,
    authToken: options.authToken,
    headers: options.headers,
  });
}
