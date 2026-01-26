'use client';

import { useAddFavorite } from '../model/useAddFavorite';
import { useAuth } from '@/shared/hooks/useAuth';
import type { FavoriteInsert } from '@/entities/favorite/model/types';
import { AUTH_ERRORS, FAVORITE_ERRORS, formatError } from '@/shared/constants/errorMessages';
import { useQuery } from '@tanstack/react-query';
import { getFavorites } from '@/entities/favorite/api/supabase';
import { favoriteKeys } from '@/entities/favorite/model/queryKeys';
import { toast } from 'sonner';
import { useModalStore } from '@/shared/stores/modalStore';

interface AddFavoriteButtonProps {
  regionId: number;
  displayName?: string | null;
  className?: string;
}

const MAX_FAVORITES = 6;

export default function AddFavoriteButton({ regionId, displayName, className }: AddFavoriteButtonProps) {
  const addFavoriteMutation = useAddFavorite();
  const { user, loading } = useAuth();
  const { openAuthModal } = useModalStore();

  // 즐겨찾기 목록 조회 (로그인된 사용자만)
  const { data: favorites } = useQuery({
    queryKey: favoriteKeys.list(),
    queryFn: getFavorites,
    enabled: !!user,
  });

  const favoritesCount = favorites?.length ?? 0;
  const isMaxLimitReached = favoritesCount >= MAX_FAVORITES;

  const handleClick = () => {
    if (!user) {
      toast.error(AUTH_ERRORS.LOGIN_REQUIRED);
      openAuthModal();
      return;
    }

    if (isMaxLimitReached) {
      toast.error(FAVORITE_ERRORS.MAX_LIMIT_REACHED);
      return;
    }

    const favorite: FavoriteInsert = {
      region_id: regionId,
      display_name: displayName,
    };
    addFavoriteMutation.mutate(favorite, {
      onSuccess: () => {
        toast.success('즐겨찾기가 추가되었습니다!');
      },
      onError: (err: Error) => {
        toast.error(formatError(FAVORITE_ERRORS.ADD_FAILED, err));
      },
    });
  };

  if (loading) {
    return (
      <button disabled className={className}>
        로딩 중...
      </button>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleClick}
        disabled={addFavoriteMutation.isPending}
        className={className}
      >
        {addFavoriteMutation.isPending ? '추가 중...' : '⭐ 즐겨찾기 추가'}
      </button>
    </div>
  );
}
