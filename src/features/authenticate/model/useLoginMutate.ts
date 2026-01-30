"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createBrowserClient } from "@/shared/api/supabase/client";

interface LoginCredentials {
  email: string;
  password: string;
}

export function useLoginMutate(
  options?: UseMutationOptions<{ success: boolean }, Error, LoginCredentials>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: async ({ email, password }: LoginCredentials) => {
      // 클라이언트에서 직접 로그인 (onAuthStateChange 자동 트리거)
      const supabase = createBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    },
    onSuccess: (data, variables, onMutateResult, context) => {
      // 계정 전환 시 이전 사용자 데이터가 남지 않도록 클라이언트 캐시 제거
      queryClient.clear();
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
