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
      titleId="update-favorite-modal-title"
    >
      <div className="p-6">
        <h2
          id="update-favorite-modal-title"
          className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4"
        >
          이름 수정
        </h2>
        <UpdateFavoriteDisplayNameForm
          favoriteId={updateFavoriteDisplayNameModal.favoriteId}
          currentDisplayName={updateFavoriteDisplayNameModal.currentDisplayName}
          regionName={updateFavoriteDisplayNameModal.regionName}
          onCancel={closeUpdateFavoriteDisplayNameModal}
        />
      </div>
    </Modal>
  );
}
