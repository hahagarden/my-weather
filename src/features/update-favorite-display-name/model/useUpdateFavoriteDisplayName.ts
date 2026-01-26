'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateFavoriteDisplayName } from '@/entities/favorite/api';
import { favoriteKeys } from '@/entities/favorite/model';

export function useUpdateFavoriteDisplayName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, displayName }: { id: number; displayName: string }) =>
      updateFavoriteDisplayName(id, displayName),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: favoriteKeys.list() });
    },
  });
}
