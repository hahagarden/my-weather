'use client';

import { useMutation } from '@tanstack/react-query';

import { createClient } from '@/shared/api/supabase/client';

import { revalidateAuth } from './actions';

interface LoginCredentials {
  email: string;
  password: string;
}

export function useLogin() {
  return useMutation({
    mutationFn: async ({ email, password }: LoginCredentials) => {
      // 클라이언트에서 직접 로그인 (onAuthStateChange 자동 트리거)
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      // 서버 캐시 무효화 (서버 액션)
      await revalidateAuth();

      return { success: true };
    },
  });
}
