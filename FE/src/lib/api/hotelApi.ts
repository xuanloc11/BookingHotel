import { fetchBackendJson } from "./backend";
import type {
  Hotel,
  HotelAvailabilityDay,
  HotelAvailabilityResponse,
  HotelDetails,
  HotelListResponse,
  HotelSearchFilters,
} from "@/types/hotel";

export interface ProvinceData {
  name: string;
  hotel_count: number;
}

export interface ProvinceResponse {
  results: ProvinceData[];
}

export async function fetchProvinces(): Promise<ProvinceData[]> {
  const response = await fetchBackendJson<ProvinceResponse>(`/provinces/`);
  return response.results;
}

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
  const params = new URLSearchParams();
  if (filters.checkIn) params.append("checkIn", filters.checkIn);
  if (filters.checkOut) params.append("checkOut", filters.checkOut);
  if (filters.rooms !== undefined) params.append("rooms", filters.rooms.toString());

  const queryString = params.toString();
  const response = await fetchBackendJson<HotelListResponse>(
    queryString ? `/hotels/?${queryString}` : "/hotels/"
  );

  return {
    hotels: applyHotelFilters(response.results, filters),
    amenities: collectAmenities(response.results),
  };
}

export async function fetchHotelBySlug(slug: string): Promise<HotelDetails> {
  try {
    const hotel = await fetchBackendJson<Hotel>(`/hotels/${slug}/`);
    return toHotelDetails(hotel);
  } catch (error) {
    throw new Error("Hotel not found.");
  }
}

export async function fetchHotelAvailability(
  slug: string,
  roomId?: number,
): Promise<HotelAvailabilityDay[]> {
  try {
    const url = roomId 
      ? `/hotels/${slug}/availability/?room_type_id=${roomId}`
      : `/hotels/${slug}/availability/`;
    const response = await fetchBackendJson<HotelAvailabilityResponse>(url);

    return response.results;
  } catch {
    const hotel = await fetchHotelBySlug(slug);
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

  if (filters.stars !== undefined) {
    params.set("stars", String(filters.stars));
  }

  if (filters.sortBy) {
    params.set("sortBy", filters.sortBy);
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

  const filtered = hotels.filter((hotel) => {
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
    const matchesReviewScore =
      filters.starRating !== undefined ? hotel.rating >= filters.starRating : true;
    const matchesStars =
      filters.stars !== undefined ? (hotel.stars || 5) >= filters.stars : true;
    const hotelAmenities = hotel.amenities.map(normalize);
    const matchesAmenities = amenities.every((amenity) =>
      hotelAmenities.some((hotelAmenity) => hotelAmenity.includes(amenity)),
    );

    return (
      matchesLocation &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesReviewScore &&
      matchesStars &&
      matchesAmenities
    );
  });

  if (filters.sortBy === "price_asc") {
    filtered.sort((a, b) => a.price_per_night - b.price_per_night);
  } else if (filters.sortBy === "price_desc") {
    filtered.sort((a, b) => b.price_per_night - a.price_per_night);
  } else if (filters.sortBy === "rating_desc") {
    filtered.sort((a, b) => b.rating - a.rating || b.reviews_count - a.reviews_count);
  }

  return filtered;
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
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000&auto=format&fit=crop",
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
