import { queryOptions } from "@tanstack/react-query";

import { getWeatherByCoords, getWeatherByRegionId } from "@/entities/weather/api";
import { QUERY_CACHE } from "@/shared/constants";

import { weatherKeys } from "./queryKeys";

export const weatherByRegionQuery = (id: number) =>
  queryOptions({
    queryKey: weatherKeys.byRegionId(id),
    queryFn: () => getWeatherByRegionId(id),
    ...QUERY_CACHE.weather,
  });

export const weatherByCoordsQuery = (lat: number, lon: number) =>
  queryOptions({
    queryKey: weatherKeys.byCoords(lat, lon),
    queryFn: () => getWeatherByCoords(lat, lon),
    ...QUERY_CACHE.weather,
  });
