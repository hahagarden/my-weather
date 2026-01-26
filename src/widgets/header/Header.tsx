'use client';

import Link from "next/link";
import { Star, SunDim } from "lucide-react";

import { LoginButton, LogoutButton } from "@/features/authenticate/ui";
import { SearchRegionInput } from "@/features/search-region/ui";
import { useAuth } from "@/shared/hooks";

export default function Header() {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-2">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="p-2 bg-blue-500 rounded-xl group-hover:bg-blue-600 transition-colors">
              <SunDim className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 hidden sm:inline">
              My Weather
            </span>
          </Link>

        {/* Search Region Input */}
        <SearchRegionInput />
        
        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {loading ? null : (user && (
            <span className="text-sm font-medium text-gray-700 hidden md:inline">
              {user.email?.split('@')[0]} 님
            </span>
          ))}

          <Link 
            href="/favorites"
            className="flex items-center gap-2 p-2 sm:px-4 sm:py-2 text-sm font-semibold text-gray-700 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
            title="즐겨찾기"
          >
            <Star className="w-5 h-5" />
            <span className="hidden sm:inline">즐겨찾기</span>
          </Link>

          {user ? <LogoutButton /> : <LoginButton />}
          </div>
        </div>
      </div>
    </header>
  );
}
