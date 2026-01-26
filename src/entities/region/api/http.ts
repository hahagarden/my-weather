import type { Region, RegionSearchItem } from "../model";

export async function getRegionsByQuery(
  query: string,
): Promise<RegionSearchItem[]> {
  const response = await fetch(`/api/regions/search?q=${query}`);
  const data = await response.json();
  return data.regions;
}

export async function getRegionById(id: number): Promise<Region> {
  const response = await fetch(`/api/regions/${id}`);
  const { data } = await response.json();
  return data;
}
