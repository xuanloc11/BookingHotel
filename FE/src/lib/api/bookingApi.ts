import { fetchBackendJson } from "./backend";
import { createBookingRequestSchema } from "@/lib/validation/checkoutSchema";
import type {
  BookingListResponse,
  BookingSummary,
  CreateBookingRequest,
  CreateBookingResponse,
} from "@/types/booking";

interface BookingApiOptions {
  authToken?: string;
  headers?: HeadersInit;
}

export async function createBooking(
  payload: CreateBookingRequest,
  options: BookingApiOptions = {},
): Promise<CreateBookingResponse> {
  const sanitizedPayload = createBookingRequestSchema.parse(payload);

  return fetchBackendJson<CreateBookingResponse>("/bookings/", {
    method: "POST",
    body: sanitizedPayload,
    authToken: options.authToken,
    headers: options.headers,
  });
}

export async function fetchMyBookings(
  options: BookingApiOptions = {},
): Promise<BookingSummary[]> {
  const response = await fetchBackendJson<BookingListResponse>("/bookings/my/", {
    authToken: options.authToken,
    headers: options.headers,
  });

  return response.results;
}

export async function fetchBookingById(
  bookingId: string,
  options: BookingApiOptions = {},
): Promise<BookingSummary> {
  return fetchBackendJson<BookingSummary>(
    `/bookings/${encodeURIComponent(bookingId)}/`,
    {
      authToken: options.authToken,
      headers: options.headers,
    },
  );
}
