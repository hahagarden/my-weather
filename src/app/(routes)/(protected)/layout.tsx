import { createServerClient } from "@/shared/api/supabase/server";
import AuthRequiredPage from "@/views/AuthRequiredPage.client";

import AuthGuard from "./(guards)/AuthGuard.client";
import ProtectedRouteMarker from "./(guards)/ProtectedRouteMarker.client";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  const isAuthorized = !!user && !authError;

  return (
    <>
      <ProtectedRouteMarker />
      <AuthGuard isAuthorized={isAuthorized} fallback={<AuthRequiredPage />}>
        {children}
      </AuthGuard>
    </>
  );
}
