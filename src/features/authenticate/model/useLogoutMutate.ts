"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createBrowserClient } from "@/shared/api/supabase/client";

export function useLogoutMutate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // 클라이언트에서 직접 로그아웃 (onAuthStateChange 자동 트리거)
      const supabase = createBrowserClient();
      await supabase.auth.signOut();

      return { success: true };
    },
    onSuccess: () => {
      // 계정 전환 시 이전 사용자 데이터가 남지 않도록 클라이언트 캐시 제거
      queryClient.clear();
    },
  });
}
