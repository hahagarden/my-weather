"use client";

import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { useRemoveFavoriteMutate } from "@/features/remove-favorite/model";
import {
  FAVORITE_ERRORS,
  FAVORITE_SUCCESSES,
  formatError,
} from "@/shared/constants";
import { useModalStore } from "@/shared/stores";
import { Modal } from "@/shared/ui";

export default function DeleteConfirmModal() {
  const { deleteModal, closeDeleteModal } = useModalStore();
  const removeFavoriteMutation = useRemoveFavoriteMutate({
    onSuccess: () => {
      toast.success(FAVORITE_SUCCESSES.DELETE_SUCCESS);
      closeDeleteModal();
    },
    onError: (err: Error) => {
      toast.error(formatError(FAVORITE_ERRORS.DELETE_FAILED, err));
    },
  });

  const handleConfirm = () => {
    if (!deleteModal.favoriteId) return;

    removeFavoriteMutation.mutate(deleteModal.favoriteId);
  };

  if (!deleteModal.isOpen || !deleteModal.favoriteId) return null;

  return (
    <Modal isOpen={deleteModal.isOpen} onClose={closeDeleteModal}>
      <div className="p-6 text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          정말 삭제하시겠습니까?
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          즐겨찾기에서 이 지역이 제거됩니다.
        </p>
        <div className="flex gap-3">
          <button
            onClick={closeDeleteModal}
            className="flex-1 py-2 text-gray-600 dark:text-gray-200 font-semibold bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2 text-white font-semibold bg-red-600 rounded-xl hover:bg-red-700 dark:hover:bg-red-500"
          >
            {removeFavoriteMutation.isPending ? "삭제 중..." : "삭제"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
