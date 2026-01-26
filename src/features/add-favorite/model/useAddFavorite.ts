'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { addFavorite } from '@/entities/favorite/api';
import { type FavoriteInsert,favoriteKeys } from '@/entities/favorite/model';

export function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (favorite: FavoriteInsert) => addFavorite(favorite),
    onSuccess: async (favorite) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: favoriteKeys.list() }),
        queryClient.invalidateQueries({ queryKey: favoriteKeys.byRegionId(favorite.region_id) }),
      ]);
    },
  });
}
