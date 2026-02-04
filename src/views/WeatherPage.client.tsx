"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, MapPin, Star } from "lucide-react";

import { getFavoriteByRegionId } from "@/entities/favorite/api";
import { favoriteKeys } from "@/entities/favorite/model";
import { getRegionById } from "@/entities/region/api";
import { regionKeys } from "@/entities/region/model";
import {
  getWeatherByCoords,
  getWeatherByRegionId,
} from "@/entities/weather/api";
import { weatherKeys } from "@/entities/weather/model";
import { AddFavoriteButton } from "@/features/add-favorite/ui";
import { RemoveFavoriteButton } from "@/features/remove-favorite/ui";
import { GENERAL_ERRORS, WEATHER_ICONS } from "@/shared/constants";
import { useAuth, useGeolocation } from "@/shared/hooks";
import { LoadingSpinner } from "@/shared/ui";
import { roundCoords } from "@/shared/utils/coords";

export default function WeatherPage({ id }: { id: number | null }) {
  const geo = useGeolocation({ enabled: id === null }); // id가 없으면 현재 위치 기반 날씨 조회
  const { user } = useAuth();

  const roundedCoords =
    geo.status === "success"
      ? roundCoords(geo.coords.lat, geo.coords.lon)
      : null;

  const { data, isLoading, isError } = useQuery({
    queryKey: id
      ? weatherKeys.byRegionId(id)
      : roundedCoords
        ? weatherKeys.byCoords(roundedCoords.lat, roundedCoords.lon)
        : ["weather", "idle"],
    queryFn: () => {
      if (id) return getWeatherByRegionId(id);
      if (!roundedCoords) throw new Error(GENERAL_ERRORS.MISSING_COORDINATES);
      return getWeatherByCoords(roundedCoords.lat, roundedCoords.lon);
    },
    enabled: Boolean(id) || geo.status === "success",
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
    [data?.hourly],
  );

  if (!id && (geo.status === "idle" || geo.status === "loading")) {
    return <LoadingSpinner />;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !data || data.daily.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 text-center shadow-lg">
          <p className="text-gray-600 dark:text-gray-400">
            해당 장소의 정보가 제공되지 않습니다.
          </p>
        </div>
      </div>
    );
  }

  const displayName = id ? (region?.regionName ?? `지역 ${id}`) : "현재 위치";
  const today = data.daily[0];
  const currentConditionKey =
    data.current.weather[0]?.icon?.slice(0, 2) ?? "01";

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative overflow-hidden bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800">
        <div className="relative p-6 md:p-8">
          <div className="flex justify-between items-start mb-6 gap-2 md:gap-4">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <MapPin className="w-4 h-4 md:w-6 md:h-6" />
              <span className="font-medium text-lg md:text-xl">
                {displayName}
              </span>
            </div>
            {id &&
              (favorite ? (
                <RemoveFavoriteButton
                  favoriteId={favorite.id}
                  className="p-2 rounded-full transition-all bg-yellow-100 dark:bg-yellow-400/20 text-yellow-500 dark:text-yellow-400 shadow-inner"
                >
                  <Star className="w-6 h-6 md:w-8 md:h-8 fill-current" />
                </RemoveFavoriteButton>
              ) : (
                <AddFavoriteButton
                  regionId={id}
                  displayName={displayName}
                  className="p-2 rounded-full transition-all bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-yellow-500 dark:hover:text-yellow-400"
                >
                  <Star className="w-6 h-6 md:w-8 md:h-8" />
                </AddFavoriteButton>
              ))}
          </div>

          <div className="flex items-center gap-6 mb-8">
            <div className="text-7xl font-bold text-gray-900 dark:text-gray-100">
              {Math.round(data.current.temp)}°
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                {WEATHER_ICONS[currentConditionKey]?.label}
              </span>
              <div className="flex gap-4 text-sm font-medium">
                <span className="flex items-center text-blue-500 dark:text-blue-400 text-lg font-bold">
                  <ArrowDown className="w-4 h-4 mr-1" />
                  {Math.round(today.temp.min)}°
                </span>
                <span className="flex items-center text-red-500 dark:text-red-400 text-lg font-bold">
                  <ArrowUp className="w-4 h-4 mr-1" />
                  {Math.round(today.temp.max)}°
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 px-2">
          시간대별 기온
        </h3>

        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {hourlyForecast.map((hour, index) => (
            <div
              key={`${hour.time}-${index}`}
              className="flex flex-col items-center min-w-[64px] p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors"
            >
              <span className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                {hour.time}
              </span>
              <div className="mb-2">
                {WEATHER_ICONS[hour.conditionKey]?.icon}
              </div>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                {hour.temp}°
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
