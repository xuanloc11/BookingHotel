import { fetchBackendJson } from "./backend";
import { readStoredAccessToken } from "./authApi";

function getAuthOptions() {
  const token = readStoredAccessToken();
  return {
    authToken: token || undefined,
  };
}

export async function getAdminDashboard(period: string = 'all', startDate?: string, endDate?: string): Promise<any> {
  const params = new URLSearchParams({ period });
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  
  return fetchBackendJson(`/system-admin/dashboard?${params.toString()}`, {
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

export async function createAdminUser(payload: any): Promise<any> {
  return fetchBackendJson(`/system-admin/users`, {
    method: "POST",
    body: payload,
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

export async function getAdminWithdrawals(): Promise<any> {
  return fetchBackendJson("/system-admin/withdrawals", {
    method: "GET",
    ...getAuthOptions(),
  });
}

export async function approveWithdrawal(withdrawalId: number): Promise<any> {
  return fetchBackendJson(`/system-admin/withdrawals/${withdrawalId}/approve`, {
    method: "POST",
    ...getAuthOptions(),
  });
}

export async function rejectWithdrawal(withdrawalId: number): Promise<any> {
  return fetchBackendJson(`/system-admin/withdrawals/${withdrawalId}/reject`, {
    method: "POST",
    ...getAuthOptions(),
  });
}

export async function cancelAdminBooking(bookingId: string): Promise<any> {
  return fetchBackendJson(`/system-admin/bookings/${bookingId}/cancel`, {
    method: "PUT",
    ...getAuthOptions(),
  });
}

export async function updateAdminBookingStatus(bookingId: string, status: string): Promise<any> {
  return fetchBackendJson(`/system-admin/bookings/${bookingId}/status`, {
    method: "PUT",
    body: { status },
    ...getAuthOptions(),
  });
}
