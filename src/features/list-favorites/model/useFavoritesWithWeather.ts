"use client";

import { useQueries, useQuery } from "@tanstack/react-query";

import {
  favoritesListQuery,
  type FavoriteWithWeather,
} from "@/entities/favorite/model";
import { regionByIdQuery } from "@/entities/region/model";
import { weatherByRegionQuery } from "@/entities/weather/model";
import { FAVORITE_ERRORS } from "@/shared/constants";

export function useFavoritesWithWeather() {
  const {
    data: favorites,
    isLoading,
    error,
  } = useQuery({
    ...favoritesListQuery(),
  });

  const regionQueries = useQueries({
    queries:
      favorites?.map((favorite) => ({
        ...regionByIdQuery(favorite.region_id),
        enabled: !!favorites && favorites.length > 0,
      })) ?? [],
  });

  const weatherQueries = useQueries({
    queries:
      favorites?.map((favorite) => ({
        ...weatherByRegionQuery(favorite.region_id),
        enabled: !!favorites && favorites.length > 0,
      })) ?? [],
  });

  const favoritesWithWeather: FavoriteWithWeather[] | undefined =
    favorites?.map((favorite, index) => ({
      ...favorite,
      region: regionQueries[index]?.data,
      regionLoading: regionQueries[index]?.isLoading ?? false,
      regionError: regionQueries[index]?.error as Error | null,
      weather: weatherQueries[index]?.data,
      weatherLoading: weatherQueries[index]?.isLoading ?? false,
      weatherError: weatherQueries[index]?.error as Error | null,
    }));

  const isRegionLoading = regionQueries.some((query) => query.isLoading);
  const isWeatherLoading = weatherQueries.some((query) => query.isLoading);
  const hasRegionError = regionQueries.some((query) => query.error);
  const hasWeatherError = weatherQueries.some((query) => query.error);

  return {
    data: favoritesWithWeather,
    isLoading: isLoading || isRegionLoading || isWeatherLoading,
    error:
      error ||
      (hasRegionError || hasWeatherError
        ? new Error(FAVORITE_ERRORS.LOAD_PARTIAL_FAILED)
        : null),
  };
}
