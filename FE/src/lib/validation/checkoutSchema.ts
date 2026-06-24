import { z } from "zod";

import { sanitizePhoneNumber, sanitizeTextInput } from "./sanitize";

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function cleanRequiredString(maxLength: number, label: string) {
  return z
    .string()
    .transform(sanitizeTextInput)
    .refine((value) => value.length > 0, `${label} is required.`)
    .refine(
      (value) => value.length <= maxLength,
      `${label} must be ${maxLength} characters or fewer.`,
    );
}

function parseDateOnly(value: string): number {
  const [year, month, day] = value.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

export const bookingGuestCountsSchema = z
  .object({
    adults: z.coerce.number().int().min(1).max(12),
    children: z.coerce.number().int().min(0).max(12),
    rooms: z.coerce.number().int().min(1).max(6),
  })
  .strict();

export const checkoutCustomerSchema = z
  .object({
    first_name: cleanRequiredString(80, "First name"),
    last_name: cleanRequiredString(80, "Last name"),
    email: z
      .string()
      .transform(sanitizeTextInput)
      .pipe(z.string().email().max(254))
      .transform((value) => value.toLowerCase()),
    phone: z
      .string()
      .transform(sanitizePhoneNumber)
      .refine((value) => value.length >= 7, "Phone number is too short.")
      .refine((value) => value.length <= 30, "Phone number is too long."),
    country: z
      .string()
      .optional()
      .transform((value) => (value ? sanitizeTextInput(value) : undefined)),
    special_requests: z
      .string()
      .optional()
      .transform((value) => (value ? sanitizeTextInput(value).slice(0, 500) : undefined)),
  })
  .strict();

export const bookingPaymentIntentSchema = z
  .object({
    method: z.enum(["pay_at_hotel", "bank_transfer", "card"]),
    provider: z.enum(["manual", "stripe", "vnpay", "momo"]).optional(),
    payment_token: z
      .string()
      .optional()
      .transform((value) => (value ? sanitizeTextInput(value).slice(0, 256) : undefined)),
    return_url: z.string().url().optional(),
  })
  .strict();

export const createBookingRequestSchema = z
  .object({
    hotel_id: z.coerce.number().int().positive(),
    check_in: z.string().regex(DATE_ONLY_PATTERN, "Check-in date is invalid."),
    check_out: z.string().regex(DATE_ONLY_PATTERN, "Check-out date is invalid."),
    guests: bookingGuestCountsSchema,
    customer: checkoutCustomerSchema,
    payment: bookingPaymentIntentSchema,
    session_id: z.string().optional(),
  })
  .strict()
  .superRefine((value, context) => {
    const checkIn = parseDateOnly(value.check_in);
    const checkOut = parseDateOnly(value.check_out);
    const nights = Math.round((checkOut - checkIn) / 86_400_000);

    if (checkOut <= checkIn) {
      context.addIssue({
        code: "custom",
        path: ["check_out"],
        message: "Check-out must be after check-in.",
      });
    }

    if (nights > 30) {
      context.addIssue({
        code: "custom",
        path: ["check_out"],
        message: "Bookings cannot exceed 30 nights.",
      });
    }
  });

export type ParsedCreateBookingRequest = z.infer<typeof createBookingRequestSchema>;
