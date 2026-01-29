"use client";

import type { ReactNode } from "react";
import { toast } from "sonner";

import { useRemoveFavorite } from "@/features/remove-favorite/model";
import {
  AUTH_ERRORS,
  FAVORITE_ERRORS,
  FAVORITE_SUCCESSES,
  formatError,
} from "@/shared/constants";
import { useAuth } from "@/shared/hooks";
import { useModalStore } from "@/shared/stores";

interface RemoveFavoriteButtonProps {
  favoriteId: number;
  className?: string;
  children?: ReactNode;
}

export default function RemoveFavoriteButton({
  favoriteId,
  className,
  children,
}: RemoveFavoriteButtonProps) {
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
        toast.success(FAVORITE_SUCCESSES.DELETE_SUCCESS);
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
      {children ??
        (removeFavoriteMutation.isPending ? "해제 중..." : "즐겨찾기 해제")}
    </button>
  );
}
