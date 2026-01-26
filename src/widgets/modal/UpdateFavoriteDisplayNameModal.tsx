"use client";

import { UpdateFavoriteDisplayNameForm } from "@/features/update-favorite-display-name/ui";
import { useModalStore } from "@/shared/stores";
import { Modal } from "@/shared/ui";

export default function UpdateFavoriteDisplayNameModal() {
  const {
    updateFavoriteDisplayNameModal,
    closeUpdateFavoriteDisplayNameModal,
  } = useModalStore();

  if (
    !updateFavoriteDisplayNameModal.isOpen ||
    !updateFavoriteDisplayNameModal.favoriteId
  )
    return null;

  return (
    <Modal
      isOpen={updateFavoriteDisplayNameModal.isOpen}
      onClose={closeUpdateFavoriteDisplayNameModal}
    >
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">이름 수정</h2>
        <UpdateFavoriteDisplayNameForm
          favoriteId={updateFavoriteDisplayNameModal.favoriteId}
          currentDisplayName={updateFavoriteDisplayNameModal.currentDisplayName}
          onCancel={closeUpdateFavoriteDisplayNameModal}
        />
      </div>
    </Modal>
  );
}
