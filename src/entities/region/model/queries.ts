import { queryOptions } from "@tanstack/react-query";

import { getRegionById, getRegionsByQuery } from "@/entities/region/api";
import { QUERY_CACHE } from "@/shared/constants";

import { regionKeys } from "./queryKeys";

export const regionByIdQuery = (id: number) =>
  queryOptions({
    queryKey: regionKeys.byId(id),
    queryFn: () => getRegionById(id),
    ...QUERY_CACHE.region,
  });

export const regionSearchQuery = (query: string) =>
  queryOptions({
    queryKey: regionKeys.search(query),
    queryFn: () => getRegionsByQuery(query),
    ...QUERY_CACHE.searchRegion,
  });
