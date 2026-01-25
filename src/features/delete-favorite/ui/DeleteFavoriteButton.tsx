'use client';

import { useDeleteFavorite } from '../model/useDeleteFavorite';
import { useState } from 'react';
import { FAVORITE_ERRORS, formatError } from '@/shared/constants/errorMessages';

interface DeleteFavoriteButtonProps {
  favoriteId: number;
  className?: string;
}

export default function DeleteFavoriteButton({ favoriteId, className }: DeleteFavoriteButtonProps) {
  const deleteFavoriteMutation = useDeleteFavorite();
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    if (!confirm('정말 이 즐겨찾기를 삭제하시겠습니까?')) {
      return;
    }

    setError(null);
    deleteFavoriteMutation.mutate(favoriteId, {
      onError: (err: Error) => {
        setError(formatError(FAVORITE_ERRORS.DELETE_FAILED, err));
      },
      onSuccess: () => {
        setError(null);
      },
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleClick}
        disabled={deleteFavoriteMutation.isPending}
        className={className}
      >
        {deleteFavoriteMutation.isPending ? '삭제 중...' : '🗑️ 삭제'}
      </button>
      {error && (
        <span className="text-xs text-red-600">{error}</span>
      )}
    </div>
  );
}
