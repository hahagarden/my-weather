import { notFound } from "next/navigation";
import { dehydrate, QueryClient } from "@tanstack/react-query";

import { QueryHydration } from "@/app/providers";
import { favoriteKeys } from "@/entities/favorite/model";
import { favoriteService } from "@/entities/favorite/server";
import { regionKeys } from "@/entities/region/model";
import { regionService } from "@/entities/region/server";
import { weatherKeys } from "@/entities/weather/model";
import { getWeatherByRegion } from "@/features/weather-by-region";
import WeatherPage from "@/views/WeatherPage.client";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = Number((await params).id);
  if (isNaN(id)) {
    notFound();
  }

  const qc = new QueryClient();

  const region = regionService.getById(id);
  qc.setQueryData(regionKeys.byId(id), region);

  const weatherPromise = qc.prefetchQuery({
    queryKey: weatherKeys.byRegionId(id),
    queryFn: () => getWeatherByRegion(region),
  });

  const favoritePromise = qc.prefetchQuery({
    queryKey: favoriteKeys.byRegionId(id),
    queryFn: () => favoriteService.getFavoriteByRegionId(id),
  });

  await Promise.all([weatherPromise, favoritePromise]);

  const dehydratedState = dehydrate(qc);

  return (
    <QueryHydration dehydratedState={dehydratedState}>
      <WeatherPage id={id} />
    </QueryHydration>
  );
}
