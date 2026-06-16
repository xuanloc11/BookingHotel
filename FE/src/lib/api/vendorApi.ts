import { readStoredAccessToken } from "./authApi";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = readStoredAccessToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'API Request failed');
  }

  return response.json();
}

export async function getVendorDashboard() {
  return fetchWithAuth('/vendor/dashboard/');
}

export async function getVendorHotel() {
  return fetchWithAuth('/vendor/hotels/');
}

export async function createVendorHotel(data: any) {
  return fetchWithAuth('/vendor/hotels/', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateVendorHotel(data: any) {
  return fetchWithAuth('/vendor/hotels/', {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function getVendorRooms() {
  return fetchWithAuth('/vendor/hotels/rooms/');
}

export async function createVendorRoom(data: any) {
  return fetchWithAuth('/vendor/hotels/rooms/', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateVendorRoom(roomId: number, data: any) {
  return fetchWithAuth(`/vendor/hotels/rooms/${roomId}/`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteVendorRoom(roomId: number) {
  return fetchWithAuth(`/vendor/hotels/rooms/${roomId}/`, {
    method: 'DELETE'
  });
}

export async function getVendorBookings() {
  return fetchWithAuth('/vendor/bookings/');
}

export async function updateVendorBookingStatus(bookingId: string, status: string) {
  return fetchWithAuth(`/vendor/bookings/${bookingId}/`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  });
}
