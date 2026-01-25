'use client';

import { useFavoritesWithWeather } from '@/features/list-favorites/model/useFavoritesWithWeather';
import WeatherCard from '@/widgets/weather-card/ui/WeatherCard';

export default function FavoritesPage() {
  const { data: favoritesWithWeather, isLoading, error } = useFavoritesWithWeather();

  if (isLoading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">즐겨찾기</h2>
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">즐겨찾기</h2>
        <div className="text-red-500">오류가 발생했습니다: {error.message}</div>
      </div>
    );
  }

  if (!favoritesWithWeather || favoritesWithWeather.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">즐겨찾기</h2>
        <div className="text-gray-500">즐겨찾기한 지역이 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">즐겨찾기</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favoritesWithWeather.map((favorite) => (
          <WeatherCard key={favorite.id} favorite={favorite} />
        ))}
      </div>
    </div>
  );
}
