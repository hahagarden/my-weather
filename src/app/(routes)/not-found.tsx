import Link from "next/link";
import { Ghost, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full text-center animate-in fade-in zoom-in duration-300">
      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-full flex items-center justify-center mb-6">
        <Ghost className="w-12 h-12" />
      </div>
      <h1 className="text-6xl font-black text-gray-200 dark:text-gray-700 mb-2">
        404
      </h1>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        존재하지 않는 페이지입니다.
      </h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
        요청하신 페이지가 삭제되었거나, 주소가 잘못 입력되었을 수 있습니다.
      </p>
      <Link
        href="/"
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 dark:hover:bg-blue-500 shadow-lg shadow-blue-100 dark:shadow-blue-900/40 transition-all active:scale-95"
      >
        <Home className="w-5 h-5" />
        <span>홈으로 돌아가기</span>
      </Link>
    </div>
  );
}
