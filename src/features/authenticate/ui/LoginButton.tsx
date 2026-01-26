'use client';

import { LogIn } from "lucide-react";

import { useModalStore } from "@/shared/stores";

export default function LoginButton() {
  const { openLoginModal } = useModalStore();

  return (
    <button
      onClick={openLoginModal}
      className="flex items-center gap-2 p-2 sm:px-4 sm:py-2 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
    >
      <LogIn className="w-5 h-5" />
      <span className="hidden sm:inline">로그인</span>
    </button>
  );
}