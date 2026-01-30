"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { createBrowserClient } from "@/shared/api/supabase/client";

interface SignUpCredentials {
  email: string;
  password: string;
}

export function useSignUpMutate(
  options?: UseMutationOptions<{ success: boolean }, Error, SignUpCredentials>,
) {
  return useMutation({
    ...options,
    mutationFn: async ({ email, password }: SignUpCredentials) => {
      // 클라이언트에서 직접 회원가입 (onAuthStateChange 자동 트리거)
      const supabase = createBrowserClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    },
  });
}
