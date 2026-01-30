"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteFavorite } from "@/entities/favorite/api";
import { type Favorite, favoriteKeys } from "@/entities/favorite/model";

export function useRemoveFavoriteMutate(
  options?: UseMutationOptions<Favorite, Error, number>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (favoriteId: number) => deleteFavorite(favoriteId),
    onSuccess: async (favorite, variables, onMutateResult, context) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: favoriteKeys.list() }),
        queryClient.invalidateQueries({
          queryKey: favoriteKeys.byRegionId(favorite.region_id),
        }),
      ]);
      options?.onSuccess?.(favorite, variables, onMutateResult, context);
    },
  });
}
