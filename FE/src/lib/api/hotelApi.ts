import { fetchBackendJson } from "./backend";
import type {
  Hotel,
  HotelAvailabilityDay,
  HotelAvailabilityResponse,
  HotelDetails,
  HotelListResponse,
  HotelSearchFilters,
} from "@/types/hotel";

export async function fetchFeaturedHotels(limit = 3): Promise<Hotel[]> {
  const response = await fetchBackendJson<HotelListResponse>(`/hotels/?limit=${limit}`);
  return response.results;
}

export async function fetchHotels(
  filters: HotelSearchFilters = {},
): Promise<Hotel[]> {
  const query = buildHotelQuery(filters);
  const response = await fetchBackendJson<HotelListResponse>(
    `/hotels/${query ? `?${query}` : ""}`,
  );

  const filteredHotels = applyHotelFilters(response.results, filters);
  return filters.limit ? filteredHotels.slice(0, filters.limit) : filteredHotels;
}

export async function fetchHotelSearchResults(
  filters: HotelSearchFilters = {},
): Promise<{ hotels: Hotel[]; amenities: string[] }> {
  const response = await fetchBackendJson<HotelListResponse>("/hotels/");

  return {
    hotels: applyHotelFilters(response.results, filters),
    amenities: collectAmenities(response.results),
  };
}

export async function fetchHotelById(id: number): Promise<HotelDetails> {
  const hotels = await fetchHotels();
  const hotel = hotels.find((item) => item.id === id);

  if (!hotel) {
    throw new Error("Hotel not found.");
  }

  return toHotelDetails(hotel);
}

export async function fetchHotelAvailability(
  hotelId: number,
): Promise<HotelAvailabilityDay[]> {
  try {
    const response = await fetchBackendJson<HotelAvailabilityResponse>(
      `/hotels/${hotelId}/availability/`,
    );

    return response.results;
  } catch {
    const hotel = await fetchHotelById(hotelId);
    return generateAvailability(hotel);
  }
}

function buildHotelQuery(filters: HotelSearchFilters): string {
  const params = new URLSearchParams();

  if (filters.location) {
    params.set("location", filters.location);
  }

  if (filters.priceMin !== undefined) {
    params.set("priceMin", String(filters.priceMin));
  }

  if (filters.priceMax !== undefined) {
    params.set("priceMax", String(filters.priceMax));
  }

  if (filters.starRating !== undefined) {
    params.set("starRating", String(filters.starRating));
  }

  filters.amenities?.forEach((amenity) => params.append("amenities", amenity));

  return params.toString();
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function applyHotelFilters(
  hotels: Hotel[],
  filters: HotelSearchFilters,
): Hotel[] {
  const location = filters.location ? normalize(filters.location) : null;
  const amenities = filters.amenities?.map(normalize).filter(Boolean) ?? [];

  return hotels.filter((hotel) => {
    const matchesLocation = location
      ? normalize(`${hotel.province} ${hotel.address}`).includes(location)
      : true;
    const matchesMinPrice =
      filters.priceMin !== undefined
        ? hotel.price_per_night >= filters.priceMin
        : true;
    const matchesMaxPrice =
      filters.priceMax !== undefined
        ? hotel.price_per_night <= filters.priceMax
        : true;
    const matchesStars =
      filters.starRating !== undefined ? hotel.rating >= filters.starRating : true;
    const hotelAmenities = hotel.amenities.map(normalize);
    const matchesAmenities = amenities.every((amenity) =>
      hotelAmenities.some((hotelAmenity) => hotelAmenity.includes(amenity)),
    );

    return (
      matchesLocation &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesStars &&
      matchesAmenities
    );
  });
}

function collectAmenities(hotels: Hotel[]): string[] {
  const amenities = new Set<string>();

  hotels.forEach((hotel) => {
    hotel.amenities.forEach((amenity) => amenities.add(amenity));
  });

  return [...amenities].sort((first, second) => first.localeCompare(second));
}

function toHotelDetails(hotel: Hotel): HotelDetails {
  return {
    ...hotel,
    images: [
      hotel.thumbnail,
      "/assets/images/thumbs/room-details-thumb1.jpg",
      "/assets/images/thumbs/room-details-thumb2.jpg",
      "/assets/images/thumbs/room-details-thumb3.jpg",
    ],
  };
}

function generateAvailability(hotel: Hotel): HotelAvailabilityDay[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: 21 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    const isAvailable = index % 6 !== 5;

    return {
      date: date.toISOString().slice(0, 10),
      available_rooms: isAvailable ? 4 - (index % 3) : 0,
      nightly_rate: hotel.price_per_night,
      is_available: isAvailable,
    };
  });
}
