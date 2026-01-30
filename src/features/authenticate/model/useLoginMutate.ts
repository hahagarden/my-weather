"use client";

import { useRouter } from "next/navigation";
import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createBrowserClient } from "@/shared/api/supabase/client";
import { useServerAuthStore } from "@/shared/stores";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginMutateOptions extends UseMutationOptions<
  { success: boolean },
  Error,
  LoginCredentials
> {
  fromProtectedPage?: boolean;
}

export function useLoginMutate(options?: LoginMutateOptions) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { startServerAuthCheck } = useServerAuthStore();
  const { fromProtectedPage, ...mutationOptions } = options ?? {};

  return useMutation({
    ...mutationOptions,
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

      if (fromProtectedPage) {
        startServerAuthCheck();
        router.refresh();
      }

      mutationOptions.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
