export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";

export type PaymentMethod = "pay_at_hotel" | "bank_transfer" | "card";

export type PaymentProvider = "manual" | "stripe" | "vnpay" | "momo";

export interface BookingGuestCounts {
  adults: number;
  children: number;
  rooms: number;
}

export interface BookingCustomerInfo {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country?: string;
  special_requests?: string;
}

export interface BookingPaymentIntent {
  method: PaymentMethod;
  provider?: PaymentProvider;
  payment_token?: string;
  return_url?: string;
}

export interface CreateBookingRequest {
  hotel_id: number;
  check_in: string;
  check_out: string;
  guests: BookingGuestCounts;
  customer: BookingCustomerInfo;
  payment: BookingPaymentIntent;
}

export interface BookingPriceBreakdown {
  currency: string;
  nightly_rate: number;
  nights: number;
  rooms: number;
  subtotal: number;
  taxes_and_fees: number;
  total: number;
}

export interface CreateBookingResponse {
  booking_id: string;
  status: BookingStatus;
  hotel_id: number;
  check_in: string;
  check_out: string;
  guests: BookingGuestCounts;
  customer_email: string;
  price?: BookingPriceBreakdown;
  confirmation_message?: string;
  created_at?: string;
}

export interface BookingSummary {
  id: number | string;
  booking_id: string;
  hotel_id: number;
  hotel_name: string;
  hotel_thumbnail?: string;
  check_in: string;
  check_out: string;
  guests: BookingGuestCounts;
  status: BookingStatus;
  total: number;
  currency: string;
  created_at: string;
}

export interface BookingListResponse {
  results: BookingSummary[];
}

export interface CheckoutSelection {
  hotel_id: number;
  check_in: string;
  check_out: string;
  guests: BookingGuestCounts;
}
