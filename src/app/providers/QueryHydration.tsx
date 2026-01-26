'use client';

import { DehydratedState, HydrationBoundary } from '@tanstack/react-query';
import { ReactNode } from 'react';

export default function QueryHydration({
  children,
  dehydratedState,
}: {
  children: ReactNode;
  dehydratedState?: DehydratedState;
}) {
  return <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>;
}
