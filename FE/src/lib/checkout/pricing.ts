import type { BookingGuestCounts, BookingPriceBreakdown } from "@/types/booking";

const DAY_IN_MS = 86_400_000;
const VAT_RATE = 0.08;
const SERVICE_FEE_RATE = 0.05;

function parseDateOnly(value: string): number {
  const [year, month, day] = value.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

export function calculateBookingPrice(input: {
  nightlyRate: number;
  checkIn: string;
  checkOut: string;
  guests: BookingGuestCounts;
  currency?: string;
}): BookingPriceBreakdown {
  const nights = Math.max(
    1,
    Math.round((parseDateOnly(input.checkOut) - parseDateOnly(input.checkIn)) / DAY_IN_MS),
  );
  const subtotal = input.nightlyRate * nights * input.guests.rooms;
  const vat = Math.round(subtotal * VAT_RATE);
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);
  const taxesAndFees = vat + serviceFee;

  return {
    currency: input.currency ?? "VND",
    nightly_rate: input.nightlyRate,
    nights,
    rooms: input.guests.rooms,
    subtotal,
    taxes_and_fees: taxesAndFees,
    total: subtotal + taxesAndFees,
  };
}
