import { fetchBackendJson } from "./backend";
import { readStoredAccessToken } from "./authApi";

function getAuthOptions() {
  const token = readStoredAccessToken();
  return {
    authToken: token || undefined,
  };
}

export async function getAdminDashboard(): Promise<any> {
  return fetchBackendJson("/system-admin/dashboard", {
    method: "GET",
    ...getAuthOptions(),
  });
}

export async function getAdminUsers(): Promise<any> {
  return fetchBackendJson("/system-admin/users", {
    method: "GET",
    ...getAuthOptions(),
  });
}

export async function getAdminHotels(): Promise<any> {
  return fetchBackendJson("/system-admin/hotels", {
    method: "GET",
    ...getAuthOptions(),
  });
}

export async function getAdminBookings(): Promise<any> {
  return fetchBackendJson("/system-admin/bookings", {
    method: "GET",
    ...getAuthOptions(),
  });
}

export async function updateAdminUser(userId: number, payload: any): Promise<any> {
  return fetchBackendJson(`/system-admin/users/${userId}`, {
    method: "PUT",
    body: payload,
    ...getAuthOptions(),
  });
}

export async function deleteAdminUser(userId: number): Promise<any> {
  return fetchBackendJson(`/system-admin/users/${userId}`, {
    method: "DELETE",
    ...getAuthOptions(),
  });
}

export async function deleteAdminHotel(hotelId: number): Promise<any> {
  return fetchBackendJson(`/system-admin/hotels/${hotelId}`, {
    method: "DELETE",
    ...getAuthOptions(),
  });
}
