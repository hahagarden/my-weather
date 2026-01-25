import Link from "next/link";
import { Ghost, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="not-found-page flex flex-col items-center justify-center min-h-[70vh] p-6 text-center animate-in fade-in zoom-in duration-300">
      <div className="w-24 h-24 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-6">
        <Ghost className="w-12 h-12" />
      </div>
      <h1 className="text-6xl font-black text-gray-200 mb-2">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">존재하지 않는 페이지입니다.</h2>
      <p className="text-gray-500 max-w-md mb-8">
        요청하신 페이지가 삭제되었거나, 주소가 잘못 입력되었을 수 있습니다.
      </p>
      <Link 
        href="/" 
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
      >
        <Home className="w-5 h-5" />
        <span>홈으로 돌아가기</span>
      </Link>
    </div>
  );
}
