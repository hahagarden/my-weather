"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createBrowserClient } from "@/shared/api/supabase/client";

interface LoginCredentials {
  email: string;
  password: string;
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
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
    onSuccess: () => {
      // 계정 전환 시 이전 사용자 데이터가 남지 않도록 클라이언트 캐시 제거
      queryClient.clear();
    },
  });
}
