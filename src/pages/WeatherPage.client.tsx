'use client';

import { getWeatherByCoords, getWeatherByRegionId } from "@/entities/weather/api/http";
import { weatherKeys } from "@/entities/weather/model/queryKeys";
import { useGeolocation } from "@/shared/hooks/useGeolocation";
import { useQuery } from "@tanstack/react-query";

export default function WeatherPage({ id }: { id: number | null }) {
  const geo = useGeolocation({enabled: id === null}); // id가 없으면 현재 위치 기반 날씨 조회
  
  const { data, isLoading } = useQuery({
      queryKey:id ? weatherKeys.byRegionId(id) : geo.status === 'success' ? weatherKeys.byCoords(geo.coords.lat, geo.coords.lon) : ['weather', 'idle'],
      queryFn: () => {
        if (id) return getWeatherByRegionId(id);
        if (!geo.coords) throw new Error('Missing coordinates');
        return getWeatherByCoords(geo.coords.lat, geo.coords.lon);
      },
      enabled: Boolean(id) || geo.status === 'success',
  });

  console.log(data);

  return <div>{isLoading ? 'Loading...' : data?.current.temp}</div>;
}