export interface Hotel {
  id: number;
  name: string;
  province: string;
  address: string;
  price_per_night: number;
  stars: number;
  rating: number;
  reviews_count: number;
  amenities: string[];
  thumbnail: string;
  description: string;
}

export interface HotelDetails extends Hotel {
  images: string[];
}

export interface HotelListResponse {
  results: Hotel[];
}

export interface HotelAvailabilityDay {
  date: string;
  available_rooms: number;
  nightly_rate: number;
  is_available: boolean;
}

export interface HotelAvailabilityResponse {
  results: HotelAvailabilityDay[];
}

export interface HotelSearchFilters {
  location?: string;
  priceMin?: number;
  priceMax?: number;
  starRating?: number;
  stars?: number;
  amenities?: string[];
  limit?: number;
  sortBy?: string;
}
