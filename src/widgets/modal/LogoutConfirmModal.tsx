"use client";

import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { useLogoutMutate } from "@/features/authenticate/model";
import { AUTH_ERRORS, AUTH_SUCCESSES } from "@/shared/constants";
import { useModalStore } from "@/shared/stores";
import { Modal } from "@/shared/ui";

export default function LogoutConfirmModal() {
  const { logoutModal, closeLogoutModal } = useModalStore();
  const logoutMutation = useLogoutMutate();

  const handleConfirm = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success(AUTH_SUCCESSES.LOGOUT_SUCCESS);
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
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <LogOut className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          로그아웃 하시겠습니까?
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          다시 로그인할 때까지 일부 기능이 제한될 수 있습니다.
        </p>
        <div className="flex gap-3">
          <button
            onClick={closeLogoutModal}
            className="flex-1 py-2 text-gray-600 dark:text-gray-200 font-semibold bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            취소
          </button>
          <button
            onClick={() => {
              handleConfirm();
              closeLogoutModal();
            }}
            className="flex-1 py-2 text-white font-semibold bg-blue-600 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-500"
          >
            로그아웃
          </button>
        </div>
      </div>
    </Modal>
  );
}
