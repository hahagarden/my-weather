'use client';

import { useAddFavorite } from '../model/useAddFavorite';
import { useAuth } from '@/shared/hooks/useAuth';
import type { FavoriteInsert } from '@/entities/favorite/model/types';
import { useState } from 'react';

interface AddFavoriteButtonProps {
  regionId: number;
  displayName?: string | null;
  className?: string;
}

export default function AddFavoriteButton({ regionId, displayName, className }: AddFavoriteButtonProps) {
  const addFavoriteMutation = useAddFavorite();
  const { user, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    if (!user) {
      setError('로그인이 필요합니다.');
      return;
    }

    setError(null);
    const favorite: FavoriteInsert = {
      region_id: regionId,
      display_name: displayName,
    };
    addFavoriteMutation.mutate(favorite, {
      onError: (err: Error) => {
        setError(err.message || '즐겨찾기 추가에 실패했습니다.');
      },
      onSuccess: () => {
        setError(null);
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
        disabled={addFavoriteMutation.isPending || !user}
        className={className}
      >
        {addFavoriteMutation.isPending ? '추가 중...' : '⭐ 즐겨찾기 추가'}
      </button>
      {error && (
        <span className="text-xs text-red-600">{error}</span>
      )}
      {!user && (
        <span className="text-xs text-gray-500">로그인이 필요합니다</span>
      )}
    </div>
  );
}
