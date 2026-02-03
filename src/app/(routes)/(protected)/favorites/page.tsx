import { dehydrate, QueryClient } from "@tanstack/react-query";

import { QueryHydration } from "@/app/providers";
import { favoriteKeys } from "@/entities/favorite/model";
import { favoriteService } from "@/entities/favorite/server";
import { regionKeys } from "@/entities/region/model";
import { regionService } from "@/entities/region/server";
import { weatherKeys } from "@/entities/weather/model";
import { weatherService } from "@/entities/weather/server";
import FavoritesPage from "@/views/FavoritesPage.client";

export default async function Page() {
  const qc = new QueryClient();

  // 1. 즐겨찾기 조회
  const favorites = await favoriteService.getFavorites();

  qc.setQueryData(favoriteKeys.list(), favorites);

  // 2. 각 favorite의 region과 weather 데이터 병렬 프리페치
  const prefetchPromises = favorites.map(async (favorite) => {
    const regionId = favorite.region_id;

    // Region 데이터 프리페치
    const regionPromise = qc.prefetchQuery({
      queryKey: regionKeys.byId(regionId),
      queryFn: () => regionService.getById(regionId),
    });

    // Weather 데이터 프리페치
    const weatherPromise = qc.prefetchQuery({
      queryKey: weatherKeys.byRegionId(regionId),
      queryFn: () => weatherService.getWeatherByRegionId(regionId),
    });

    return Promise.all([regionPromise, weatherPromise]);
  });

  // 모든 프리페치 완료 대기
  await Promise.all(prefetchPromises);

  const dehydratedState = dehydrate(qc);

  return (
    <QueryHydration dehydratedState={dehydratedState}>
      <FavoritesPage />
    </QueryHydration>
  );
}
