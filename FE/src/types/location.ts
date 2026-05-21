export interface ProvinceSummary {
  name: string;
  hotel_count: number;
}

export interface ProvinceListResponse {
  results: ProvinceSummary[];
}
