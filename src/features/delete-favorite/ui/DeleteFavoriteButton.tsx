'use client';

import { useModalStore } from '@/shared/stores/modalStore';

interface DeleteFavoriteButtonProps {
  favoriteId: number;
  className?: string;
}

export default function DeleteFavoriteButton({ favoriteId, className }: DeleteFavoriteButtonProps) {
  const { openDeleteModal } = useModalStore();

  return (
    <button
      onClick={() => openDeleteModal(favoriteId)}
      className={className}
    >
      🗑️ 삭제
    </button>
  );
}
