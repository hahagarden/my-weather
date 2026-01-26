'use client';

import { useModalStore } from '@/shared/stores/modalStore';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const { openLogoutModal } = useModalStore();

  return (
    <button
      onClick={openLogoutModal}
      className="flex items-center gap-2 p-2 sm:px-4 sm:py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
    >
      <LogOut className="w-5 h-5" />
      <span className="hidden sm:inline">로그아웃</span>
    </button>
  );
}
