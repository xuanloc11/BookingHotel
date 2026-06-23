import type { HotelSearchFilters } from "@/types/hotel";

export type PageSearchParams = Record<string, string | string[] | undefined>;

function getFirstValue(
  params: PageSearchParams,
  key: string,
): string | undefined {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

function getStringList(params: PageSearchParams, key: string): string[] {
  const value = params[key];

  if (!value) {
    return [];
  }

  const values = Array.isArray(value) ? value : value.split(",");
  return values.map((item) => item.trim()).filter(Boolean);
}

function getPositiveNumber(
  params: PageSearchParams,
  key: string,
): number | undefined {
  const value = getFirstValue(params, key);
  const parsedValue = value ? Number(value) : Number.NaN;

  return Number.isFinite(parsedValue) && parsedValue >= 0
    ? parsedValue
    : undefined;
}

export function parseHotelSearchParams(
  params: PageSearchParams,
): HotelSearchFilters {
  const priceMin = getPositiveNumber(params, "priceMin");
  const priceMax = getPositiveNumber(params, "priceMax");
  const starRating = getPositiveNumber(params, "starRating");
  const stars = getPositiveNumber(params, "stars");
  const rooms = getPositiveNumber(params, "rooms");
  const adults = getPositiveNumber(params, "adults");
  const children = getPositiveNumber(params, "children");

  return {
    location: getFirstValue(params, "location")?.trim() || undefined,
    priceMin,
    priceMax:
      priceMin !== undefined && priceMax !== undefined && priceMax < priceMin
        ? undefined
        : priceMax,
    starRating:
      starRating !== undefined && starRating >= 1 && starRating <= 5
        ? starRating
        : undefined,
    stars:
      stars !== undefined && stars >= 1 && stars <= 5
        ? stars
        : undefined,
    amenities: getStringList(params, "amenities"),
    sortBy: getFirstValue(params, "sortBy"),
    checkIn: getFirstValue(params, "checkIn"),
    checkOut: getFirstValue(params, "checkOut"),
    rooms,
    adults,
    children,
  };
}

export function hasHotelFilters(filters: HotelSearchFilters): boolean {
  return Boolean(
    filters.location ||
      filters.priceMin !== undefined ||
      filters.priceMax !== undefined ||
      filters.starRating !== undefined ||
      filters.stars !== undefined ||
      (filters.amenities && filters.amenities.length > 0) ||
      filters.sortBy ||
      filters.checkIn ||
      filters.checkOut ||
      filters.rooms !== undefined ||
      filters.adults !== undefined ||
      filters.children !== undefined,
  );
}
