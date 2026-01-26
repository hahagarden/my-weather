import { QueryHydration } from '@/app/providers';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import FavoritesPage from '@/views/FavoritesPage.client';
import { favoriteService } from '@/entities/favorite/server/service';
import { favoriteKeys } from '@/entities/favorite/model/queryKeys';
import { regionService } from '@/entities/region/server/service';
import { regionKeys } from '@/entities/region/model/queryKeys';
import { weatherService } from '@/entities/weather/server/service';
import { weatherKeys } from '@/entities/weather/model/queryKeys';
import { createClient } from '@/shared/api/supabase/server';
import AuthRequiredPage from '@/views/AuthRequiredPage.client';

export default async function Page() {
  // 로그인 확인
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return <AuthRequiredPage />;
  }

  const qc = new QueryClient();

  try {
    // 1. 즐겨찾기 조회
    const favorites = await favoriteService.getFavorites();
    
    qc.setQueryData(favoriteKeys.list(), favorites);

    // 2. 각 favorite의 region과 weather 데이터 병렬 프리페치
    const prefetchPromises = favorites.map(async (favorite) => {
      const regionId = favorite.region_id;
      
      // Region 데이터 프리페치
      const regionPromise = qc.prefetchQuery({
        queryKey: regionKeys.byId(regionId),
        queryFn: () => regionService.getById(regionId),
      });

      // Weather 데이터 프리페치
      const weatherPromise = qc.prefetchQuery({
        queryKey: weatherKeys.byRegionId(regionId),
        queryFn: () => weatherService.getWeatherByRegionId(regionId),
      });

      return Promise.all([regionPromise, weatherPromise]);
    });

    // 모든 프리페치 완료 대기
    await Promise.all(prefetchPromises);
  } catch (error) {
    // 에러가 발생해도 페이지는 렌더링 (클라이언트에서 재시도 가능)
    console.error('Failed to prefetch favorites data:', error);
  }

  const dehydratedState = dehydrate(qc);
  
  return (
    <QueryHydration dehydratedState={dehydratedState}>
      <FavoritesPage />
    </QueryHydration>
  );
}
