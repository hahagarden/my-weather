'use client';

import type { FavoriteWithWeather } from '@/entities/favorite/model/types';
import Image from 'next/image';
import DeleteFavoriteButton from '@/features/delete-favorite/ui/DeleteFavoriteButton';
import { useModalStore } from '@/shared/stores/modalStore';

interface WeatherCardProps {
  favorite: FavoriteWithWeather;
}

export default function WeatherCard({ favorite }: WeatherCardProps) {
  const { region, regionLoading, weather, weatherLoading, weatherError } = favorite;
  const { openUpdateFavoriteDisplayNameModal } = useModalStore();

  const displayName = favorite.display_name || region?.regionName;

  if (regionLoading || weatherLoading) {
    return (
      <div className="border rounded-lg p-4 bg-gray-50 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      </div>
    );
  }

  if (weatherError || !weather) {
    return (
      <div className="border rounded-lg p-4 bg-gray-50">
        <p className="text-gray-500">날씨 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const current = weather.current;
  const weatherMain = current.weather[0];

  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold mb-1">
              {displayName}
            </h3>
            <button
              onClick={() => openUpdateFavoriteDisplayNameModal(favorite.id, displayName ?? '')}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="이름 편집"
            >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            </div>
          <p className="text-sm text-gray-500">
            {new Date(current.localTime).toLocaleString('ko-KR')}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">
            {Math.round(current.temp)}°C
          </div>
          <div className="text-sm text-gray-600">
            체감 {Math.round(current.feels_like)}°C
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        {weatherMain && (
          <>
            <div className="text-4xl">
              {weatherMain.icon && (
                <Image
                  width={64}
                  height={64}
                  src={`https://openweathermap.org/img/wn/${weatherMain.icon}@2x.png`}
                  alt={weatherMain.description}
                  className="w-16 h-16"
                />
              )}
            </div>
            <div>
              <p className="font-medium capitalize">{weatherMain.description}</p>
              <p className="text-sm text-gray-600">{weatherMain.main}</p>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <span className="text-gray-600">최고온도</span>
          <span className="ml-2 font-medium">{weather.daily[0].temp.max}°C</span>
        </div>
        <div>
          <span className="text-gray-600">최저온도</span>
          <span className="ml-2 font-medium">{weather.daily[0].temp.min}°C</span>
        </div>
      </div>

      <div className="flex justify-end">
        <DeleteFavoriteButton
          favoriteId={favorite.id}
          className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
        />
      </div>
    </div>
  );
}
