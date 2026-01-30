"use client";

import { useEffect } from "react";

import { useProtectedRoute } from "@/shared/contexts/ProtectedRouteContext";

export default function ProtectedRouteMarker() {
  const { setProtectedRoute } = useProtectedRoute();

  useEffect(() => {
    setProtectedRoute(true);
    return () => setProtectedRoute(false);
  }, [setProtectedRoute]);

  return null;
}
