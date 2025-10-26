import { create } from 'zustand';

interface AuthModalStore {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const useAuthModalStore = create<AuthModalStore>((set) => ({
  isOpen: false,
  setIsOpen: (open) => set({ isOpen: open }),
}));

export default useAuthModalStore;