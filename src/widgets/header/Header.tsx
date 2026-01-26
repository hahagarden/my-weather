'use client';

import SearchRegionInput from "@/features/search-region/ui/SearchRegionInput";
import Link from "next/link";
import { useAuth } from "@/shared/hooks/useAuth";
import LogoutButton from "@/features/authenticate/ui/LogoutButton";
import { useModalStore } from "@/shared/stores/modalStore";

export default function Header() {
  const { user, loading } = useAuth();
  const { openLoginModal } = useModalStore();

  return (
    <header className="relative border-b pb-4 mb-4">
      <div className="flex items-center gap-4 flex-wrap">
        <Link href="/" className="text-xl font-bold">My Weather</Link>
        <SearchRegionInput />
        <Link href="/favorites" className="text-blue-600 hover:text-blue-800">
          즐겨찾기
        </Link>
        
        <div className="ml-auto flex items-center gap-2">
          {loading ? (
            <span className="text-sm text-gray-500">로딩 중...</span>
          ) : user ? (
            <>
              <span className="text-sm text-gray-700">{user.email}</span>
              <LogoutButton />
            </>
          ) : (
            <>
              <button
                onClick={openLoginModal}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                로그인
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
