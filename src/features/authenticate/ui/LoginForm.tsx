"use client";

import { FormEvent, useState } from "react";
import { Lock, Mail } from "lucide-react";
import { toast } from "sonner";

import { useLoginMutate, useSignUpMutate } from "@/features/authenticate/model";
import {
  AUTH_ERRORS,
  AUTH_SUCCESSES,
  formatError,
  SUPABASE_ERRORS,
} from "@/shared/constants";
import { useProtectedRoute } from "@/shared/contexts/ProtectedRouteContext";

interface LoginFormProps {
  isSignUp: boolean;
  onClose: () => void;
}

export default function LoginForm({ isSignUp, onClose }: LoginFormProps) {
  const { isProtectedRoute } = useProtectedRoute();
  const [error, setError] = useState<string | null>(null);
  const handleAuthError = (err: unknown) => {
    const errMessage = (err as { message?: string }).message?.toLowerCase();

    if (errMessage?.includes(SUPABASE_ERRORS.WEAK_PASSWORD)) {
      setError(AUTH_ERRORS.WEAK_PASSWORD);
      return;
    }
    if (errMessage?.includes(SUPABASE_ERRORS.EMAIL_NOT_CONFIRMED)) {
      setError(AUTH_ERRORS.EMAIL_NOT_CONFIRMED);
      return;
    }
    if (errMessage?.includes(SUPABASE_ERRORS.INVALID_CREDENTIALS)) {
      setError(AUTH_ERRORS.INVALID_CREDENTIALS);
      return;
    }

    setError(formatError(AUTH_ERRORS.AUTH_FAILED, err as Error));
  };

  const loginMutation = useLoginMutate({
    fromProtectedPage: isProtectedRoute,
    onSuccess: () => {
      toast.success(AUTH_SUCCESSES.LOGIN_SUCCESS);
      onClose();
    },
    onError: handleAuthError,
  });
  const signUpMutation = useSignUpMutate({
    onSuccess: () => {
      toast.success(AUTH_SUCCESSES.SIGNUP_EMAIL_SENT);
      onClose();
    },
    onError: handleAuthError,
  });

  const isPending = loginMutation.isPending || signUpMutation.isPending;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      setError(AUTH_ERRORS.EMAIL_PASSWORD_REQUIRED);
      return;
    }

    const mutation = isSignUp ? signUpMutation : loginMutation;

    mutation.mutate({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          이메일
        </label>
        <div className="relative">
          <input
            id="login-email"
            name="email"
            type="email"
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="email@example.com"
            autoComplete="email"
            autoFocus
          />
          <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 dark:text-gray-500" aria-hidden />
        </div>
      </div>
      <div>
        <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          비밀번호
        </label>
        <div className="relative">
          <input
            id="login-password"
            name="password"
            type="password"
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="••••••••"
            autoComplete={isSignUp ? "new-password" : "current-password"}
          />
          <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 dark:text-gray-500" aria-hidden />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-95"
      >
        {isPending ? "로딩중..." : isSignUp ? "가입하기" : "로그인"}
      </button>
      {error && (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </form>
  );
}
