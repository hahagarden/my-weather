"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { LoginForm } from "@/features/authenticate/ui";
import { useModalStore } from "@/shared/stores";
import { Modal } from "@/shared/ui";

export default function LoginModal() {
  const { loginModal, closeLoginModal } = useModalStore();
  const [mode, setMode] = useState<"login" | "signup">("login");

  const handleClose = () => {
    closeLoginModal();
    setMode("login");
  };

  return (
    <Modal
      isOpen={loginModal.isOpen}
      onClose={handleClose}
      titleId="login-modal-title"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2
            id="login-modal-title"
            className="text-2xl font-bold text-gray-800 dark:text-gray-100"
          >
            {mode === "login" ? "로그인" : "회원가입"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            aria-label="닫기"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden />
          </button>
        </div>

        <LoginForm isSignUp={mode === "signup"} onClose={handleClose} />

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline"
          >
            {mode === "login"
              ? "계정이 없으신가요? 회원가입"
              : "이미 계정이 있으신가요? 로그인"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
