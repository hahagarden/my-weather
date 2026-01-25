'use client';

import { useLogout } from '../model/useLogout';

export default function LogoutButton() {
  const logoutMutation = useLogout();

  return (
    <button
      onClick={() => logoutMutation.mutate()}
      disabled={logoutMutation.isPending}
      className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {logoutMutation.isPending ? '로그아웃 중...' : '로그아웃'}
    </button>
  );
}
