import { queryOptions } from "@tanstack/react-query";

import {
  getFavoriteByRegionId,
  getFavorites,
} from "@/entities/favorite/api";
import { QUERY_CACHE } from "@/shared/constants";

import { favoriteKeys } from "./queryKeys";

export const favoritesListQuery = () =>
  queryOptions({
    queryKey: favoriteKeys.list(),
    queryFn: getFavorites,
    ...QUERY_CACHE.favorites,
  });

export const favoriteByRegionIdQuery = (regionId: number) =>
  queryOptions({
    queryKey: favoriteKeys.byRegionId(regionId),
    queryFn: () => getFavoriteByRegionId(regionId),
    ...QUERY_CACHE.favorites,
  });
