import { fetchBackendJson } from "./backend";
import type { ProvinceListResponse, ProvinceSummary } from "@/types/location";

export async function fetchProvinces(): Promise<ProvinceSummary[]> {
  const response = await fetchBackendJson<ProvinceListResponse>("/provinces/");
  return response.results;
}
