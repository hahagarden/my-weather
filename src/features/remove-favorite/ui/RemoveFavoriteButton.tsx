'use client';

import { useRemoveFavorite } from '../model/useRemoveFavorite';
import { useAuth } from '@/shared/hooks/useAuth';
import { AUTH_ERRORS, FAVORITE_ERRORS, formatError } from '@/shared/constants/errorMessages';
import { FAVORITE_TOASTS } from '@/shared/constants/toastMessages';
import { toast } from 'sonner';
import { useModalStore } from '@/shared/stores/modalStore';

interface RemoveFavoriteButtonProps {
  favoriteId: number;
  className?: string;
}

export default function RemoveFavoriteButton({ favoriteId, className }: RemoveFavoriteButtonProps) {
  const removeFavoriteMutation = useRemoveFavorite();
  const { user } = useAuth();
  const { openLoginModal } = useModalStore();

  const handleClick = () => {
    if (!user) {
      toast.error(AUTH_ERRORS.LOGIN_REQUIRED);
      openLoginModal();
      return;
    }

    removeFavoriteMutation.mutate(favoriteId, {
      onSuccess: () => {
        toast.success(FAVORITE_TOASTS.DELETE_SUCCESS);
      },
      onError: (err: Error) => {
        toast.error(formatError(FAVORITE_ERRORS.DELETE_FAILED, err));
      },
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={removeFavoriteMutation.isPending}
      className={className}
    >
      {removeFavoriteMutation.isPending ? '해제 중...' : '즐겨찾기 해제'}
    </button>
  );
}
