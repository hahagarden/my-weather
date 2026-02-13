"use client";

import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { type FavoriteInsert, favoritesListQuery } from "@/entities/favorite/model";
import { useAddFavoriteMutate } from "@/features/add-favorite/model";
import {
  AUTH_ERRORS,
  FAVORITE_ERRORS,
  FAVORITE_SUCCESSES,
  formatError,
} from "@/shared/constants";
import { useAuth } from "@/shared/hooks";
import { useModalStore } from "@/shared/stores";

interface AddFavoriteButtonProps {
  regionId: number;
  displayName?: string | null;
  className?: string;
  children?: ReactNode;
  /** 아이콘만 넣을 때 스크린 리더용 이름 (예: "서울 즐겨찾기 추가") */
  ariaLabel?: string;
}

const MAX_FAVORITES = 6;

export default function AddFavoriteButton({
  regionId,
  displayName,
  className,
  children,
  ariaLabel,
}: AddFavoriteButtonProps) {
  const { user } = useAuth();
  const { openLoginModal } = useModalStore();

  const addFavoriteMutation = useAddFavoriteMutate({
    onSuccess: () => {
      toast.success(FAVORITE_SUCCESSES.ADD_SUCCESS);
    },
    onError: (err: Error) => {
      toast.error(formatError(FAVORITE_ERRORS.ADD_FAILED, err));
    },
  });

  const { data: favorites } = useQuery({
    ...favoritesListQuery(),
    enabled: !!user,
  });

  const handleClick = () => {
    if (!user) {
      toast.error(AUTH_ERRORS.LOGIN_REQUIRED);
      openLoginModal();
      return;
    }

    const favoritesCount = favorites?.length ?? 0;
    const isMaxLimitReached = favoritesCount >= MAX_FAVORITES;
    if (isMaxLimitReached) {
      toast.error(FAVORITE_ERRORS.MAX_LIMIT_REACHED);
      return;
    }

    const favorite: FavoriteInsert = {
      region_id: regionId,
      display_name: displayName,
    };
    addFavoriteMutation.mutate(favorite);
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={addFavoriteMutation.isPending}
        className={className}
        aria-label={ariaLabel}
      >
        {children ??
          (addFavoriteMutation.isPending ? "추가 중..." : "⭐ 즐겨찾기 추가")}
      </button>
    </div>
  );
}
