"use client";

import { createContext, useContext, useMemo, useState } from "react";

interface ProtectedRouteContextValue {
  isProtectedRoute: boolean;
  setProtectedRoute: (isProtectedRoute: boolean) => void;
}

const ProtectedRouteContext = createContext<ProtectedRouteContextValue | null>(
  null,
);

export function ProtectedRouteProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isProtectedRoute, setProtectedRoute] = useState(false);
  const value = useMemo(
    () => ({ isProtectedRoute, setProtectedRoute }),
    [isProtectedRoute],
  );

  return (
    <ProtectedRouteContext.Provider value={value}>
      {children}
    </ProtectedRouteContext.Provider>
  );
}

export function useProtectedRoute() {
  const context = useContext(ProtectedRouteContext);
  if (!context) {
    throw new Error(
      "useProtectedRoute must be used within ProtectedRouteProvider",
    );
  }
  return context;
}
