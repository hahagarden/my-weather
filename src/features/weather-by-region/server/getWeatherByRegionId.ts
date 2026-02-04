import "server-only";

import type { Region } from "@/entities/region/model";
import { regionService } from "@/entities/region/server";
import { weatherService } from "@/entities/weather/server";

export async function getWeatherByRegionId(regionId: number) {
  const region = regionService.getById(regionId);
  return getWeatherByRegion(region);
}

export async function getWeatherByRegion(region: Region) {
  return weatherService.getWeatherByCoords(
    Number(region.lat),
    Number(region.lon),
  );
}
