'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addFavorite } from '@/entities/favorite/api/supabase';
import { favoriteKeys } from '@/entities/favorite/model/queryKeys';
import type { FavoriteInsert } from '@/entities/favorite/model/types';

export function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (favorite: FavoriteInsert) => addFavorite(favorite),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: favoriteKeys.list() });
    },
  });
}
