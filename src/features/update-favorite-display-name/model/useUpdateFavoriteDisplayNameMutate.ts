"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateFavoriteDisplayName } from "@/entities/favorite/api";
import { type Favorite, favoriteKeys } from "@/entities/favorite/model";

type UpdateFavoriteDisplayNamePayload = { id: number; displayName: string };

export function useUpdateFavoriteDisplayNameMutate(
  options?: UseMutationOptions<
    Favorite,
    Error,
    UpdateFavoriteDisplayNamePayload
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ id, displayName }: UpdateFavoriteDisplayNamePayload) =>
      updateFavoriteDisplayName(id, displayName),
    onSuccess: async (favorite, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: favoriteKeys.list() });
      options?.onSuccess?.(favorite, variables, onMutateResult, context);
    },
  });
}
