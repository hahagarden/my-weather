"use client";

import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Edit2, Trash2 } from "lucide-react";

import type { FavoriteWithWeather } from "@/entities/favorite/model";
import { WEATHER_CONDITIONS } from "@/shared/constants";
import { useModalStore } from "@/shared/stores";

interface WeatherCardProps {
  favorite: FavoriteWithWeather;
}

export default function WeatherCard({ favorite }: WeatherCardProps) {
  const { region, regionLoading, weather, weatherLoading, weatherError } =
    favorite;
  const { openUpdateFavoriteDisplayNameModal, openDeleteModal } =
    useModalStore();
  const router = useRouter();

  const displayName = favorite.display_name || region?.regionName;

  const onEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    openUpdateFavoriteDisplayNameModal(favorite.id, displayName || "", region?.regionName || "");
  };

  const onDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    openDeleteModal(favorite.id);
  };

  const onClick = () => {
    router.push(`/${favorite.region_id}`);
  };

  if (regionLoading || weatherLoading) {
    return (
      <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900/60 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-2"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
      </div>
    );
  }

  if (weatherError || !weather) {
    return (
      <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900/60">
        <p className="text-gray-500 dark:text-gray-400">
          날씨 정보를 불러올 수 없습니다.
        </p>
      </div>
    );
  }

  const today = weather.daily[0];

  const current = weather.current;
  const currentImage = WEATHER_CONDITIONS[current.weather[0].icon.slice(0, 2)];

  return (
    <div
      className="group relative bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-md border border-gray-100 dark:border-gray-800 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4 gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {displayName}
          </h3>
        </div>
        <div className="flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
          {currentImage.icon}
        </div>
        <div className="flex-1">
          <div className="text-3xl font-black text-gray-800 dark:text-gray-100">
            {Math.round(current.temp)}°
          </div>
          <div className="flex gap-3 text-sm font-bold mt-1">
            <span className="flex items-center text-blue-500">
              <ArrowDown className="w-3 h-3 mr-1" />
              {Math.round(today.temp.min)}°
            </span>
            <span className="flex items-center text-red-500">
              <ArrowUp className="w-3 h-3 mr-1" />
              {Math.round(today.temp.max)}°
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-800">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {currentImage.label}
        </span>
      </div>
    </div>
  );
}
