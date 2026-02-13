import { Metadata } from "next";
import { dehydrate, QueryClient } from "@tanstack/react-query";

import { QueryHydration } from "@/app/providers";
import { favoriteKeys } from "@/entities/favorite/model";
import { favoriteService } from "@/entities/favorite/server";
import { regionKeys } from "@/entities/region/model";
import { regionService } from "@/entities/region/server";
import { weatherKeys } from "@/entities/weather/model";
import { getWeatherByRegion } from "@/features/weather-by-region";
import FavoritesPage from "@/views/FavoritesPage.client";

export const metadata: Metadata = {
  title: "즐겨찾기",
};

export default async function Page() {
  const qc = new QueryClient();

  // 1. 즐겨찾기 조회
  const favorites = await favoriteService.getFavorites();

  qc.setQueryData(favoriteKeys.list(), favorites);

  // 2. 각 favorite의 region과 weather 데이터 병렬 프리페치
  const prefetchPromises = favorites.map(async (favorite) => {
    const regionId = favorite.region_id;

    const region = regionService.getById(regionId);
    qc.setQueryData(regionKeys.byId(regionId), region);

    // Weather 데이터 프리페치
    const weatherPromise = qc.prefetchQuery({
      queryKey: weatherKeys.byRegionId(regionId),
      queryFn: () => getWeatherByRegion(region),
    });

    return weatherPromise;
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
