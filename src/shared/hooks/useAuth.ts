'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/shared/api/supabase/client';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const initAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        setLoading(false);
    };
    
    initAuth();

    // 인증 상태 변경 감지 - Supabase 클라이언트가 직접 인증 작업을 수행할 때 자동으로 트리거됨
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  return { user, loading };
}
