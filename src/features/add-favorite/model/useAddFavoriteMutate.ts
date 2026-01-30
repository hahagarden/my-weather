"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addFavorite } from "@/entities/favorite/api";
import {
  type Favorite,
  type FavoriteInsert,
  favoriteKeys,
} from "@/entities/favorite/model";

export function useAddFavoriteMutate(
  options?: UseMutationOptions<Favorite, Error, FavoriteInsert>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (favorite: FavoriteInsert) => addFavorite(favorite),
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
