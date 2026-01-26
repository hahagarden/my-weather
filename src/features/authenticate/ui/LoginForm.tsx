'use client';

import { FormEvent, useState } from 'react';
import { useLogin } from '../model/useLogin';
import { useSignUp } from '../model/useSignUp';
import { AUTH_ERRORS, formatError, SUPABASE_ERRORS } from '@/shared/constants/errorMessages';
import { AUTH_TOASTS } from '@/shared/constants/toastMessages';
import { useModalStore } from '@/shared/stores/modalStore';
import { toast } from 'sonner';
import { Lock, Mail } from 'lucide-react';

export default function LoginForm({ isSignUp }: { isSignUp: boolean }) {
  const [error, setError] = useState<string | null>(null);
  const loginMutation = useLogin();
  const signUpMutation = useSignUp();
  const { closeLoginModal } = useModalStore();

  const isPending = loginMutation.isPending || signUpMutation.isPending;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      setError(AUTH_ERRORS.EMAIL_PASSWORD_REQUIRED);
      return;
    }

    const mutation = isSignUp ? signUpMutation : loginMutation;

    mutation.mutate(
      { email, password },
      {
        onError: (err: unknown) => {
          const errMessage = (err as { message?: string }).message?.toLowerCase();
          
          if(errMessage?.includes(SUPABASE_ERRORS.WEAK_PASSWORD)) {
            setError(AUTH_ERRORS.WEAK_PASSWORD);
            return;
          }
          if(errMessage?.includes(SUPABASE_ERRORS.EMAIL_NOT_CONFIRMED)) {
            setError(AUTH_ERRORS.EMAIL_NOT_CONFIRMED);
            return;
          }
          if(errMessage?.includes(SUPABASE_ERRORS.INVALID_CREDENTIALS)) {
            setError(AUTH_ERRORS.INVALID_CREDENTIALS);
            return;
          }

          setError(formatError(AUTH_ERRORS.AUTH_FAILED, err as Error));
        },
        onSuccess: () => {
          toast.success(isSignUp ? AUTH_TOASTS.SIGNUP_EMAIL_SENT : AUTH_TOASTS.LOGIN_SUCCESS);
          closeLoginModal();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <div className="relative">
              <input
                name="email"
                type="email"
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="email@example.com"
              />
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <div className="relative">
              <input
                name="password"
                type="password"
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            {isPending ? '로딩중...' : isSignUp ? '가입하기' : '로그인'}
          </button>
          {error && <span className="text-xs text-red-600">{error}</span>}
        </form>
  );
}
