'use client';

import { Star } from 'lucide-react';

import { useFavoritesWithWeather } from '@/features/list-favorites/model';
import { GENERAL_ERRORS } from '@/shared/constants';
import { LoadingSpinner } from '@/shared/ui';
import { WeatherCard } from '@/widgets/weather-card';

export default function FavoritesPage() {
  const { data: favoritesWithWeather, isLoading, error } = useFavoritesWithWeather();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-6xl mx-auto sm:p-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-8">
        <Star className="w-8 h-8 text-yellow-500 fill-current" />
        <h1 className="text-3xl font-black text-gray-900">내 즐겨찾기</h1>
      </div>

      { error 
      ? <div className="text-red-500">{GENERAL_ERRORS.RETRY}</div> 
      : !favoritesWithWeather || favoritesWithWeather.length === 0 
      ? <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 text-lg">아직 즐겨찾는 지역이 없습니다.</p>
          <p className="text-gray-400 text-sm mt-1">상단 검색창에서 지역을 검색해 즐겨찾기에 추가해보세요.</p>
        </div>
      : <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favoritesWithWeather.map((fav) => (
            <WeatherCard key={fav.id} favorite={fav} />
          ))}
        </div>
      }       
    </div>
  );
}
