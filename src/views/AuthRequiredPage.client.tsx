'use client';

import Link from 'next/link';
import { Lock, Home, LogIn } from 'lucide-react';

export default function AuthRequiredError() {
  const onLoginClick = () => {
    // Header의 로그인 버튼 클릭과 동일한 동작을 하도록 커스텀 이벤트 발생
    window.dispatchEvent(new CustomEvent('openLoginForm'));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6 shadow-sm border border-blue-100">
        <Lock className="w-10 h-10" />
      </div>
      <h2 className="text-3xl font-black text-gray-800 mb-4 tracking-tight">로그인이 필요합니다</h2>
      <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
        즐겨찾기 기능을 이용하시려면 로그인이 필요합니다.<br />
        로그인 후 나만의 날씨 목록을 관리해보세요!
      </p>
      <div className="flex flex-col sm:flex-row gap-5">
        <button 
          onClick={onLoginClick}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95 group"
        >
          <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <span>지금 로그인하기</span>
        </button>
        <Link 
          href="/" 
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all active:scale-95"
        >
          <Home className="w-5 h-5" />
          <span>홈으로 가기</span>
        </Link>
      </div>
    </div>
  );
}
