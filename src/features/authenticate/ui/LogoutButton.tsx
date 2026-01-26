'use client';

import { useModalStore } from '@/shared/stores/modalStore';

export default function LogoutButton() {
  const { openLogoutModal } = useModalStore();

  return (
    <button
      onClick={openLogoutModal}
      className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
    >
      로그아웃
    </button>
  );
}
