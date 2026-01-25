'use client';

import { getWeatherByCoords, getWeatherByRegionId } from "@/entities/weather/api/http";
import { weatherKeys } from "@/entities/weather/model/queryKeys";
import { useGeolocation } from "@/shared/hooks/useGeolocation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import AddFavoriteButton from "@/features/add-favorite/ui/AddFavoriteButton";
import { GENERAL_ERRORS } from "@/shared/constants/errorMessages";

export default function WeatherPage({ id }: { id: number | null }) {
  const geo = useGeolocation({enabled: id === null}); // id가 없으면 현재 위치 기반 날씨 조회
  
  const { data, isLoading } = useQuery({
      queryKey:id ? weatherKeys.byRegionId(id) : geo.status === 'success' ? weatherKeys.byCoords(geo.coords.lat, geo.coords.lon) : ['weather', 'idle'],
      queryFn: () => {
        if (id) return getWeatherByRegionId(id);
        if (!geo.coords) throw new Error(GENERAL_ERRORS.MISSING_COORDINATES);
        return getWeatherByCoords(geo.coords.lat, geo.coords.lon);
      },
      enabled: Boolean(id) || geo.status === 'success',
  });

  console.log(data);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>{isLoading 
        ? 'Loading...' 
        : <>
            <div>현재 기온 {data?.current.temp}°C</div>
            <div>최고 기온 {data?.daily[0].temp.max}°C</div>
            <div>최저 기온 {data?.daily[0].temp.min}°C</div>
            <div>시간대별 날씨 {data?.hourly.slice(0, 24).map(h => <div key={h.dt}><Image width={20} height={20} src={`https://openweathermap.org/img/wn/${h.weather[0].icon}@2x.png`} alt={h.weather[0].description} />{h.temp}°C, {h.localTime.toDateString()}</div>)}</div>
          </>
        }
      </div>
        {id && <AddFavoriteButton regionId={id} />}
      </div>
    </div>
  );
}