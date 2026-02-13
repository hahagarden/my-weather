"use client";

import type { ReactNode } from "react";
import { toast } from "sonner";

import { useRemoveFavoriteMutate } from "@/features/remove-favorite/model";
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
  /** 아이콘만 넣을 때 스크린 리더용 이름 (예: "서울 즐겨찾기 해제") */
  ariaLabel?: string;
}

export default function RemoveFavoriteButton({
  favoriteId,
  className,
  children,
  ariaLabel,
}: RemoveFavoriteButtonProps) {
  const removeFavoriteMutation = useRemoveFavoriteMutate({
    onSuccess: () => {
      toast.success(FAVORITE_SUCCESSES.DELETE_SUCCESS);
    },
    onError: (err: Error) => {
      toast.error(formatError(FAVORITE_ERRORS.DELETE_FAILED, err));
    },
  });
  const { user } = useAuth();
  const { openLoginModal } = useModalStore();

  const handleClick = () => {
    if (!user) {
      toast.error(AUTH_ERRORS.LOGIN_REQUIRED);
      openLoginModal();
      return;
    }

    removeFavoriteMutation.mutate(favoriteId);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={removeFavoriteMutation.isPending}
      className={className}
      aria-label={ariaLabel}
    >
      {children ??
        (removeFavoriteMutation.isPending ? "해제 중..." : "즐겨찾기 해제")}
    </button>
  );
}
