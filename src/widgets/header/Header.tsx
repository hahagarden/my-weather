"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Moon, Star, SunDim } from "lucide-react";

import { LoginButton, LogoutButton } from "@/features/authenticate/ui";
import { SearchRegionInput } from "@/features/search-region/ui";
import { useAuth } from "@/shared/hooks";

export default function Header() {
  const { user, loading } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    const storedTheme = window.localStorage.getItem("theme");
    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    }

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    return prefersDark ? "dark" : "light";
  }); // script에서 초기화된 테마 값과 동일

  // 서버렌더(theme 초기값: light) 하이드레이션 에러 방지를 위해 사용
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const themeTitle = isHydrated
    ? theme === "dark"
      ? "라이트 모드"
      : "다크 모드"
    : "테마 전환";
  const themeAriaLabel = isHydrated
    ? theme === "dark"
      ? "라이트 모드로 전환"
      : "다크 모드로 전환"
    : "테마 전환";

  useEffect(() => {
    const isDark = theme === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-2">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group shrink-0"
            aria-label="홈"
          >
            <div className="p-2 bg-blue-500 rounded-xl group-hover:bg-blue-600 transition-colors">
              <SunDim className="w-6 h-6 text-white" aria-hidden />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 hidden md:inline">
              My Weather
            </span>
          </Link>

          {/* Search Region Input */}
          <SearchRegionInput />

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {loading
              ? null
              : user && (
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden md:inline">
                    {user.email?.split("@")[0]} 님
                  </span>
                )}

            <Link
              href="/favorites"
              className="flex items-center gap-2 p-2 sm:px-4 sm:py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-yellow-50 dark:bg-gray-800 hover:bg-yellow-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="즐겨찾기"
              aria-label="즐겨찾기"
            >
              <Star className="w-5 h-5" aria-hidden />
              <span className="hidden md:inline">즐겨찾기</span>
            </Link>

            <button
              type="button"
              onClick={() =>
                setTheme((prev) => (prev === "dark" ? "light" : "dark"))
              }
              className="flex items-center justify-center p-2 sm:px-4 sm:py-2 rounded-lg text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title={themeTitle}
              aria-label={themeAriaLabel}
            >
              <SunDim className="w-5 h-5 hidden dark:block" aria-hidden />
              <Moon className="w-5 h-5 dark:hidden" aria-hidden />
            </button>

            {user ? <LogoutButton /> : <LoginButton />}
          </div>
        </div>
      </div>
    </header>
  );
}
