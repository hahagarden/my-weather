'use client';

import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

import { useLogout } from '@/features/authenticate/model';
import { AUTH_ERRORS, AUTH_TOASTS } from '@/shared/constants';
import { useModalStore } from '@/shared/stores';
import { Modal } from '@/shared/ui';

export default function LogoutConfirmModal() {
  const { logoutModal, closeLogoutModal } = useModalStore();
  const logoutMutation = useLogout();

  const handleConfirm = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success(AUTH_TOASTS.LOGOUT_SUCCESS);
        closeLogoutModal();
      },
      onError: () => {
        toast.error(AUTH_ERRORS.LOGOUT_FAILED);
      },
    });
  };

  return (
    <Modal isOpen={logoutModal.isOpen} onClose={closeLogoutModal}>
      <div className="p-6 text-center">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <LogOut className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">로그아웃 하시겠습니까?</h2>
        <p className="text-gray-500 mb-6">다시 로그인할 때까지 일부 기능이 제한될 수 있습니다.</p>
        <div className="flex gap-3">
          <button
            onClick={closeLogoutModal}
            className="flex-1 py-2 text-gray-600 font-semibold bg-gray-100 rounded-xl hover:bg-gray-200"
          >
            취소
          </button>
          <button
            onClick={() => { handleConfirm(); closeLogoutModal(); }}
            className="flex-1 py-2 text-white font-semibold bg-blue-600 rounded-xl hover:bg-blue-700"
          >
            로그아웃
          </button>
        </div>
      </div>
    </Modal>
  );
}
