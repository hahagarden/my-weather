import "./globals.css";

import type { Metadata, Viewport } from "next";

import { ProtectedRouteProvider } from "@/shared/contexts/ProtectedRouteContext";

import { QueryProvider, ToastProvider } from "./providers";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://my-weather.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "내 날씨 | 지역별 날씨 한눈에",
    template: "%s | 내 날씨",
  },
  description:
    "전국 지역별 현재 날씨와 예보를 한눈에 확인하세요. 즐겨찾기로 자주 보는 지역을 모아보세요.",
  keywords: [
    "날씨",
    "기상",
    "지역 날씨",
    "날씨 예보",
    "실시간 날씨",
    "한국 날씨",
    "우리나라 날씨",
    "전국 날씨",
  ],
  openGraph: {
    title: "내 날씨 | 지역별 날씨 한눈에",
    description: "전국 지역별 현재 날씨와 예보를 한눈에 확인하세요.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "내 날씨 | 지역별 날씨 한눈에",
    description: "전국 지역별 현재 날씨와 예보를 한눈에 확인하세요.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const themeScript = `
(() => {
  try {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme =
      storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : prefersDark
          ? "dark"
          : "light";
    document.documentElement.classList.toggle("dark", theme === "dark");
  } catch {
    // no-op
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body suppressHydrationWarning>
        <ProtectedRouteProvider>
          <QueryProvider>
            <ToastProvider />
            {children}
          </QueryProvider>
        </ProtectedRouteProvider>
      </body>
    </html>
  );
}
