"use client";

import { useState } from "react";
import { toast } from "sonner";

import { useUpdateFavoriteDisplayName } from "@/features/update-favorite-display-name/model";
import {
  FAVORITE_ERRORS,
  FAVORITE_TOASTS,
  formatError,
} from "@/shared/constants";

interface UpdateFavoriteDisplayNameFormProps {
  favoriteId: number;
  currentDisplayName: string;
  onCancel?: () => void;
}

export default function UpdateFavoriteDisplayNameForm({
  favoriteId,
  currentDisplayName,
  onCancel,
}: UpdateFavoriteDisplayNameFormProps) {
  const [displayName, setDisplayName] = useState(currentDisplayName);
  const [error, setError] = useState<string | null>(null);
  const updateFavoriteDisplayNameMutation = useUpdateFavoriteDisplayName();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!displayName.trim()) {
      setError(FAVORITE_ERRORS.DISPLAY_NAME_REQUIRED);
      return;
    }

    updateFavoriteDisplayNameMutation.mutate(
      { id: favoriteId, displayName: displayName.trim() },
      {
        onError: (err: Error) => {
          setError(
            formatError(FAVORITE_ERRORS.UPDATE_DISPLAY_NAME_FAILED, err),
          );
        },
        onSuccess: () => {
          onCancel?.();
          toast.success(FAVORITE_TOASTS.UPDATE_DISPLAY_NAME_SUCCESS);
        },
      },
    );
  };

  const handleCancel = () => {
    setDisplayName(currentDisplayName);
    setError(null);
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="text"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all mb-6"
        placeholder={currentDisplayName}
      />
      <div className="flex gap-3">
        <button
          onClick={handleCancel}
          className="flex-1 py-2 text-gray-600 font-semibold bg-gray-100 rounded-xl hover:bg-gray-200"
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 py-2 text-white font-semibold bg-blue-600 rounded-xl hover:bg-blue-700"
        >
          {updateFavoriteDisplayNameMutation.isPending ? "저장 중..." : "저장"}
        </button>
      </div>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </form>
  );
}
