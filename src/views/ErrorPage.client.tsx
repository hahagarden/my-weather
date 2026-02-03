"use client";

import Link from "next/link";
import { Home, RefreshCw, WifiOff } from "lucide-react";

type ErrorPageProps = {
  onRetry: () => void;
};

export default function ErrorPage({ onRetry }: ErrorPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full text-center animate-in fade-in zoom-in duration-500">
      <div className="w-24 h-24 bg-red-50 text-red-400 rounded-full flex items-center justify-center mb-6 shadow-sm border border-red-100">
        <WifiOff className="w-12 h-12" />
      </div>
      <h2 className="text-3xl font-black text-gray-800 mb-4 tracking-tight">
        네트워크 연결 오류
      </h2>
      <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
        정보를 가져오는 중에 문제가 발생했습니다.
        <br />
        인터넷 연결을 확인하거나 잠시 후 다시 시도해주세요.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onRetry}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95 group"
        >
          <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          <span>다시 시도하기</span>
        </button>
        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all active:scale-95"
        >
          <Home className="w-5 h-5" />
          <span>홈으로 이동</span>
        </Link>
      </div>
    </div>
  );
}
