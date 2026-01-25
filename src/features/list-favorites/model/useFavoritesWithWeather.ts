'use client';

import { useQueries, useQuery } from '@tanstack/react-query';
import { getWeatherByRegionId } from '@/entities/weather/api/http';
import { weatherKeys } from '@/entities/weather/model/queryKeys';
import { getRegionById } from '@/entities/region/api/http';
import { regionKeys } from '@/entities/region/model/queryKeys';
import type { FavoriteWithWeather } from '@/entities/favorite/model/types';
import { getFavorites } from '@/entities/favorite/api/supabase';
import { favoriteKeys } from '@/entities/favorite/model/queryKeys';

export function useFavoritesWithWeather() {
  const { data: favorites, isLoading, error } = useQuery({
    queryKey: favoriteKeys.list(),
    queryFn: getFavorites,
  });

  const regionQueries = useQueries({
    queries: favorites?.map((favorite) => ({
      queryKey: regionKeys.byId(favorite.region_id),
      queryFn: () => getRegionById(favorite.region_id),
      enabled: !!favorites && favorites.length > 0,
    })) ?? [],
  });

  const weatherQueries = useQueries({
    queries: favorites?.map((favorite) => ({
      queryKey: weatherKeys.byRegionId(favorite.region_id),
      queryFn: () => getWeatherByRegionId(favorite.region_id),
      enabled: !!favorites && favorites.length > 0,
    })) ?? [],
  });

  const favoritesWithWeather: FavoriteWithWeather[] | undefined = favorites?.map(
    (favorite, index) => ({
      ...favorite,
      region: regionQueries[index]?.data,
      regionLoading: regionQueries[index]?.isLoading ?? false,
      regionError: regionQueries[index]?.error as Error | null,
      weather: weatherQueries[index]?.data,
      weatherLoading: weatherQueries[index]?.isLoading ?? false,
      weatherError: weatherQueries[index]?.error as Error | null,
    })
  );

  const isRegionLoading = regionQueries.some((query) => query.isLoading);
  const isWeatherLoading = weatherQueries.some((query) => query.isLoading);
  const hasRegionError = regionQueries.some((query) => query.error);
  const hasWeatherError = weatherQueries.some((query) => query.error);

  return {
    data: favoritesWithWeather,
    isLoading: isLoading || isRegionLoading || isWeatherLoading,
    error: error || (hasRegionError || hasWeatherError ? new Error('일부 정보를 불러오는데 실패했습니다.') : null),
  };
}
