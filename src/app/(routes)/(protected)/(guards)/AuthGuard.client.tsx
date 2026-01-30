"use client";

import { ReactNode, useEffect } from "react";

import { useServerAuthStore } from "@/shared/stores";
import { LoadingSpinner } from "@/shared/ui";

interface AuthGuardProps {
  isAuthorized: boolean;
  children?: ReactNode;
  fallback?: ReactNode;
}

export default function AuthGuard({
  isAuthorized,
  children,
  fallback,
}: AuthGuardProps) {
  const { isCheckingServerAuth, confirmServerAuth } = useServerAuthStore();

  useEffect(() => {
    if (isAuthorized) {
      confirmServerAuth();
    }
  }, [isAuthorized, confirmServerAuth]);

  if (!isAuthorized) {
    if (isCheckingServerAuth) {
      return <LoadingSpinner />;
    }

    return <>{fallback ?? null}</>;
  }

  return <>{children}</>;
}
