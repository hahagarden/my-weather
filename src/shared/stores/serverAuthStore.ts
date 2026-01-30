import { create } from "zustand";

interface ServerAuthStore {
  isCheckingServerAuth: boolean;
  startServerAuthCheck: () => void;
  confirmServerAuth: () => void;
}

export const useServerAuthStore = create<ServerAuthStore>((set) => ({
  isCheckingServerAuth: false,
  startServerAuthCheck: () => set({ isCheckingServerAuth: true }),
  confirmServerAuth: () => set({ isCheckingServerAuth: false }),
}));
