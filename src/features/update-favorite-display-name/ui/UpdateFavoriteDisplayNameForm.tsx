'use client';

import { useState } from 'react';
import { useUpdateFavoriteDisplayName } from '../model/useUpdateFavoriteDisplayName';

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
      setError('이름을 입력해주세요.');
      return;
    }

    updateFavoriteDisplayNameMutation.mutate(
      { id: favoriteId, displayName: displayName.trim() },
      {
        onError: (err: Error) => {
          setError(err.message || '이름 변경에 실패했습니다.');
        },
        onSuccess: () => {
          onCancel?.();
        },
      }
    );
  };

  const handleCancel = () => {
    setDisplayName(currentDisplayName);
    setError(null);
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          disabled={updateFavoriteDisplayNameMutation.isPending}
          className="flex-1 px-2 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
          placeholder={currentDisplayName}
        />
        <button
          type="submit"
          disabled={updateFavoriteDisplayNameMutation.isPending}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          {updateFavoriteDisplayNameMutation.isPending ? '저장 중...' : '저장'}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={updateFavoriteDisplayNameMutation.isPending}
          className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 transition-colors"
        >
          취소
        </button>
      </div>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </form>
  );
}
