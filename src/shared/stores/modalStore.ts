import { create } from 'zustand';

interface ModalStore {
  // Auth Modal
  loginModal: { isOpen: boolean };
  openLoginModal: () => void;
  closeLoginModal: () => void;

  // Logout Confirm Modal
  logoutModal: { isOpen: boolean };
  openLogoutModal: () => void;
  closeLogoutModal: () => void;

  // Display Name Edit Modal
  updateFavoriteDisplayNameModal: { isOpen: boolean; favoriteId: number | null; currentDisplayName: string };
  openUpdateFavoriteDisplayNameModal: (favoriteId: number, currentDisplayName: string) => void;
  closeUpdateFavoriteDisplayNameModal: () => void;

  // Delete Confirm Modal
  deleteModal: { isOpen: boolean; favoriteId: number | null };
  openDeleteModal: (favoriteId: number) => void;
  closeDeleteModal: () => void;
}

export const useModalStore = create<ModalStore>((set: (partial: Partial<ModalStore> | ((state: ModalStore) => Partial<ModalStore>)) => void) => ({
  // Auth Modal
  loginModal: { isOpen: false },
  openLoginModal: () => set({ loginModal: { isOpen: true } }),
  closeLoginModal: () => set({ loginModal: { isOpen: false } }),

  // Logout Confirm Modal
  logoutModal: { isOpen: false },
  openLogoutModal: () => set({ logoutModal: { isOpen: true } }),
  closeLogoutModal: () => set({ logoutModal: { isOpen: false } }),

  // Display Name Edit Modal
  updateFavoriteDisplayNameModal: { isOpen: false, favoriteId: null, currentDisplayName: '' },
  openUpdateFavoriteDisplayNameModal: (favoriteId: number, currentDisplayName: string) =>
    set({ updateFavoriteDisplayNameModal: { isOpen: true, favoriteId, currentDisplayName } }),
  closeUpdateFavoriteDisplayNameModal: () =>
    set({ updateFavoriteDisplayNameModal: { isOpen: false, favoriteId: null, currentDisplayName: '' } }),

  // Delete Confirm Modal
  deleteModal: { isOpen: false, favoriteId: null },
  openDeleteModal: (favoriteId: number) => set({ deleteModal: { isOpen: true, favoriteId } }),
  closeDeleteModal: () => set({ deleteModal: { isOpen: false, favoriteId: null } }),
}));
