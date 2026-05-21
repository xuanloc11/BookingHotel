export interface Hotel {
  id: number;
  name: string;
  province: string;
  address: string;
  price_per_night: number;
  rating: number;
  reviews_count: number;
  amenities: string[];
  thumbnail: string;
  description: string;
}

export interface HotelListResponse {
  results: Hotel[];
}
