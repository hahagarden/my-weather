'use client';

import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowDown, ArrowUp, MapPin, Star, SunDim } from "lucide-react";
import { getWeatherByCoords, getWeatherByRegionId } from "@/entities/weather/api/http";
import { weatherKeys } from "@/entities/weather/model/queryKeys";
import { useGeolocation } from "@/shared/hooks/useGeolocation";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import AddFavoriteButton from "@/features/add-favorite/ui/AddFavoriteButton";
import { GENERAL_ERRORS } from "@/shared/constants/errorMessages";
import { getFavoriteByRegionId } from "@/entities/favorite/api/supabase";
import { favoriteKeys } from "@/entities/favorite/model/queryKeys";
import RemoveFavoriteButton from "@/features/remove-favorite/ui/RemoveFavoriteButton";
import { useAuth } from "@/shared/hooks/useAuth";
import { WEATHER_CONDITIONS } from "@/shared/constants/weatherConditions";
import { getRegionById } from "@/entities/region/api/http";
import { regionKeys } from "@/entities/region/model/queryKeys";

export default function WeatherPage({ id }: { id: number | null }) {
  const geo = useGeolocation({enabled: id === null}); // id가 없으면 현재 위치 기반 날씨 조회
  const { user } = useAuth();
  
  const { data, isLoading } = useQuery({
      queryKey:id ? weatherKeys.byRegionId(id) : geo.status === 'success' ? weatherKeys.byCoords(geo.coords.lat, geo.coords.lon) : ['weather', 'idle'],
      queryFn: () => {
        if (id) return getWeatherByRegionId(id);
        if (!geo.coords) throw new Error(GENERAL_ERRORS.MISSING_COORDINATES);
        return getWeatherByCoords(geo.coords.lat, geo.coords.lon);
      },
      enabled: Boolean(id) || geo.status === 'success',
  });

  const { data: favorite } = useQuery({
    queryKey: favoriteKeys.byRegionId(id ?? 0),
    queryFn: () => getFavoriteByRegionId(id as number),
    enabled: Boolean(id) && !!user,
  });

  const { data: region } = useQuery({
    queryKey: regionKeys.byId(id ?? 0),
    queryFn: () => getRegionById(id as number),
    enabled: Boolean(id),
  });

  const hourlyForecast = useMemo(
    () =>
      (data?.hourly ?? []).slice(0, 24).map((hour) => ({
        time: hour.localTime.toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        temp: Math.round(hour.temp),
        conditionKey: hour.weather[0]?.icon?.slice(0, 2) ?? "01",
      })),
    [data?.hourly]
  );

  if (!data || isLoading) {
    return <LoadingSpinner />;
  }

  const displayName = id ? (region?.regionName ?? `지역 ${id}`) : "현재 위치";
  const today = data.daily[0];
  const currentConditionKey = data.current.weather[0]?.icon?.slice(0, 2) ?? "01";
  const conditionInfo = WEATHER_CONDITIONS[currentConditionKey] ?? WEATHER_CONDITIONS["01"];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative overflow-hidden bg-white rounded-3xl shadow-xl border border-gray-100">
        <div className="relative p-6 md:p-8">
          <div className="flex justify-between items-start mb-6 gap-2 md:gap-4">
            <div className="flex items-center gap-2 text-gray-500">
              <MapPin className="w-4 h-4 md:w-6 md:h-6" />
              <span className="font-medium text-lg md:text-xl">{displayName}</span>
            </div>
            {id && (
              favorite ? (
                <RemoveFavoriteButton
                  favoriteId={favorite.id}
                  className="p-2 rounded-full transition-all bg-yellow-100 text-yellow-500 shadow-inner"
                >
                  <Star className="w-6 h-6 md:w-8 md:h-8 fill-current" />
                </RemoveFavoriteButton>
              ) : (
                <AddFavoriteButton
                  regionId={id}
                  displayName={displayName}
                  className="p-2 rounded-full transition-all bg-gray-100 text-gray-400 hover:text-yellow-500"
                >
                  <Star className="w-6 h-6 md:w-8 md:h-8" />
                </AddFavoriteButton>
              )
            )}
          </div>

          <div className="flex items-center gap-6 mb-8">
            <div className="text-7xl font-bold text-gray-900">{Math.round(data.current.temp)}°</div>
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-semibold text-gray-800">{conditionInfo.label}</span>
              <div className="flex gap-4 text-sm font-medium">
                <span className="flex items-center text-blue-500 text-lg">
                  <ArrowDown className="w-3 h-3 mr-1" />
                  {Math.round(today.temp.min)}°
                </span>
                <span className="flex items-center text-red-500 text-lg">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  {Math.round(today.temp.max)}°
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 px-2">시간대별 기온</h3>

        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {hourlyForecast.map((hour, index) => {
            const condition = WEATHER_CONDITIONS[hour.conditionKey] ?? WEATHER_CONDITIONS["01"];
            return (
              <div key={`${hour.time}-${index}`} className="flex flex-col items-center min-w-[64px] p-3 rounded-2xl hover:bg-gray-50 transition-colors">
                <span className="text-xs text-gray-400 mb-2">{hour.time}</span>
                <div className="mb-2">
                  {condition?.icon ?? <SunDim className="w-6 h-6 text-yellow-500" />}
                </div>
                <span className="text-sm font-bold text-gray-700">{hour.temp}°</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}