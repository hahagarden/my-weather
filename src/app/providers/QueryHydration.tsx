"use client";

import { ReactNode } from "react";
import { DehydratedState, HydrationBoundary } from "@tanstack/react-query";

export default function QueryHydration({
  children,
  dehydratedState,
}: {
  children: ReactNode;
  dehydratedState?: DehydratedState;
}) {
  return (
    <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
  );
}
