'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteFavorite } from '@/entities/favorite/api/supabase';
import { favoriteKeys } from '@/entities/favorite/model/queryKeys';

export function useDeleteFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteFavorite(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: favoriteKeys.list() });
    },
  });
}
