'use client';

import { useMutation } from '@tanstack/react-query';

import { createClient } from '@/shared/api/supabase/client';

import { revalidateAuth } from './actions';

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      // 클라이언트에서 직접 로그아웃 (onAuthStateChange 자동 트리거)
      const supabase = createClient();
      await supabase.auth.signOut();
      
      // 서버 캐시 무효화 (서버 액션)
      await revalidateAuth();
      
      return { success: true };
    },
  });
}
