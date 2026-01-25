'use client';

import { FormEvent, useState } from 'react';
import { useLogin } from '../model/useLogin';
import { useSignUp } from '../model/useSignUp';
import { AUTH_ERRORS, formatError } from '@/shared/constants/errorMessages';

export default function LoginForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loginMutation = useLogin();
  const signUpMutation = useSignUp();

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
        onError: (err: Error) => {
          setError(formatError(AUTH_ERRORS.AUTH_FAILED, err));
        },
        onSuccess: (data) => {
          console.log(data);
          window.alert('로그인 성공');
        },
      }
    );
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-4">
        {isSignUp ? '회원가입' : '로그인'}
      </h2>
      <form id="auth-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            이메일
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="example@email.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>
        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? '처리 중...' : isSignUp ? '회원가입' : '로그인'}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError(null);
          }}
          className="w-full text-sm text-gray-600 hover:text-gray-800"
        >
          {isSignUp ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}
        </button>
      </form>
    </div>
  );
}
