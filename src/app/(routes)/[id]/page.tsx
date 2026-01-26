import { QueryHydration } from "@/app/providers";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import WeatherPage from "@/views/WeatherPage.client";
import { weatherKeys } from "@/entities/weather/model/queryKeys";
import { weatherService } from "@/entities/weather/server/service";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (isNaN(id)) {
    notFound();
  }

  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey: weatherKeys.byRegionId(id),
    queryFn: () => weatherService.getWeatherByRegionId(id),
  });

  const dehydratedState = dehydrate(qc);
  return (
    <QueryHydration dehydratedState={dehydratedState}>
      <WeatherPage id={id} />
    </QueryHydration>
  );
}