import Header from "@/widgets/header/Header";
import { LoginModal, LogoutConfirmModal, UpdateFavoriteDisplayNameModal, DeleteConfirmModal } from "@/widgets/modal";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen relative">
      <Header />
      <div className="flex-1 p-6">{children}</div>

      {/* Modals */}
      <LoginModal />
      <LogoutConfirmModal />
      <UpdateFavoriteDisplayNameModal />
      <DeleteConfirmModal />
    </div>
  );
}