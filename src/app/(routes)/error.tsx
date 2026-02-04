"use client"; // error.tsx 에서 필수

import ErrorPage from "@/views/ErrorPage.client";

export default function Error({ reset }: { reset: () => void }) {
  return <ErrorPage onRetry={reset} />;
}
