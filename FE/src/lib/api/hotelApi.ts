import { fetchBackendJson } from "./backend";
import type { Hotel, HotelListResponse } from "@/types/hotel";

export async function fetchFeaturedHotels(limit = 3): Promise<Hotel[]> {
  const response = await fetchBackendJson<HotelListResponse>(`/hotels/?limit=${limit}`);
  return response.results;
}
