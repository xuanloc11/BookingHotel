import { readStoredAccessToken } from "./authApi";
import { fetchBackendJson } from "./backend";

function getAuthOptions(options: any = {}) {
  const token = readStoredAccessToken();
  return {
    ...options,
    authToken: token || undefined,
  };
}

export async function getExtranetDashboard() {
  return fetchBackendJson<any>('/vendor/dashboard/', getAuthOptions());
}

export async function getVendorFinance() {
  return fetchBackendJson<any>('/vendor/finance/', getAuthOptions());
}

export async function getVendorHotel() {
  return fetchBackendJson<any>('/vendor/hotels/', getAuthOptions());
}

export async function createVendorHotel(data: any) {
  return fetchBackendJson<any>('/vendor/hotels/', getAuthOptions({
    method: 'POST',
    body: data
  }));
}

export async function updateVendorHotel(data: any) {
  return fetchBackendJson<any>('/vendor/hotels/', getAuthOptions({
    method: 'PUT',
    body: data
  }));
}

export async function getVendorRooms() {
  return fetchBackendJson<any>('/vendor/hotels/rooms/', getAuthOptions());
}

export async function createVendorRoom(data: any) {
  return fetchBackendJson<any>('/vendor/hotels/rooms/', getAuthOptions({
    method: 'POST',
    body: data
  }));
}

export async function updateVendorRoom(roomId: number, data: any) {
  return fetchBackendJson<any>(`/vendor/hotels/rooms/${roomId}/`, getAuthOptions({
    method: 'PUT',
    body: data
  }));
}

export async function deleteVendorRoom(roomId: number) {
  return fetchBackendJson<any>(`/vendor/hotels/rooms/${roomId}/`, getAuthOptions({
    method: 'DELETE'
  }));
}

export async function getVendorBookings() {
  return fetchBackendJson<any>('/vendor/bookings/', getAuthOptions());
}

export async function updateVendorBookingStatus(bookingId: string, status: string) {
  return fetchBackendJson<any>(`/vendor/bookings/${bookingId}/`, getAuthOptions({
    method: 'PUT',
    body: { status }
  }));
}

export async function getVendorWithdrawals() {
  return fetchBackendJson<any>('/vendor/withdrawals/', getAuthOptions());
}

export async function createVendorWithdrawal(amount: number) {
  return fetchBackendJson<any>('/vendor/withdrawals/', getAuthOptions({
    method: 'POST',
    body: { amount }
  }));
}
