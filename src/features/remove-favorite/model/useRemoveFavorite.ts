"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteFavorite } from "@/entities/favorite/api";
import { favoriteKeys } from "@/entities/favorite/model";

export function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (favoriteId: number) => deleteFavorite(favoriteId),
    onSuccess: async (favorite) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: favoriteKeys.list() }),
        queryClient.invalidateQueries({
          queryKey: favoriteKeys.byRegionId(favorite.region_id),
        }),
      ]);
    },
  });
}
