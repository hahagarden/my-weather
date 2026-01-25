import { createClient } from './client';
import type { User } from '@supabase/supabase-js';
import { AUTH_ERRORS } from '@/shared/constants/errorMessages';

/**
 * 현재 로그인한 사용자를 가져옵니다.
 * 로그인하지 않은 경우 에러를 throw합니다.
 */
export async function getCurrentUser(): Promise<User> {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error(AUTH_ERRORS.LOGIN_REQUIRED);
  }
  
  return user;
}
