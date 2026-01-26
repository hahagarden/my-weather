import { QueryHydration } from "@/app/providers";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import WeatherPage from "@/views/WeatherPage.client";
import { weatherKeys } from "@/entities/weather/model/queryKeys";
import { weatherService } from "@/entities/weather/server/service";
import { notFound } from "next/navigation";
import { favoriteKeys } from "@/entities/favorite/model/queryKeys";
import { favoriteService } from "@/entities/favorite/server/service";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (isNaN(id)) {
    notFound();
  }

  const qc = new QueryClient();

  const weatherPromise = qc.prefetchQuery({
    queryKey: weatherKeys.byRegionId(id),
    queryFn: () => weatherService.getWeatherByRegionId(id),
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