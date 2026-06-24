import { z } from "zod";

import { bookingGuestCountsSchema } from "@/lib/validation/checkoutSchema";
import type { CheckoutSelection } from "@/types/booking";

type PageSearchParams = Record<string, string | string[] | undefined>;

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const checkoutSelectionSchema = z
  .object({
    hotel_id: z.coerce.number().int().positive(),
    room_selections: z.array(z.object({
      room_type_id: z.number().int().positive(),
      quantity: z.number().int().positive()
    })).optional(),
    check_in: z.string().regex(DATE_ONLY_PATTERN),
    check_out: z.string().regex(DATE_ONLY_PATTERN),
    guests: bookingGuestCountsSchema,
  })
  .strict()
  .refine((value) => value.check_out > value.check_in, {
    message: "Check-out must be after check-in.",
    path: ["check_out"],
  });

function firstValue(
  params: PageSearchParams,
  key: string,
): string | undefined {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export function parseCheckoutParams(
  params: PageSearchParams,
): CheckoutSelection | null {
  let parsedRoomSelections = undefined;
  try {
    const rsString = firstValue(params, "roomSelections");
    if (rsString) {
      parsedRoomSelections = JSON.parse(rsString);
    }
  } catch(e) {}

  const result = checkoutSelectionSchema.safeParse({
    hotel_id: firstValue(params, "hotelId"),
    room_selections: parsedRoomSelections,
    check_in: firstValue(params, "checkIn"),
    check_out: firstValue(params, "checkOut"),
    guests: {
      adults: firstValue(params, "adults") ?? "1",
      children: firstValue(params, "children") ?? "0",
      rooms: firstValue(params, "rooms") ?? "1",
    },
  });

  return result.success ? result.data : null;
}
