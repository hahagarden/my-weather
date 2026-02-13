import { Loader2 } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-500"
    >
      <Loader2
        className="w-16 h-16 text-blue-200 animate-spin"
        aria-hidden
      />
      <p className="mt-8 text-lg font-bold text-gray-400 animate-pulse">
        정보를 불러오는 중입니다...
      </p>
    </div>
  );
}
