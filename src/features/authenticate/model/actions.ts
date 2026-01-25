'use server';

import { revalidatePath } from 'next/cache';

// 서버 캐시만 무효화하는 함수 (클라이언트에서 인증 작업 후 호출)
export async function revalidateAuth() {
  revalidatePath('/', 'layout');
}
