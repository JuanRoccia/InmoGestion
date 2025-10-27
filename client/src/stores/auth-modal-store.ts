import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthModalStore {
  isOpen: boolean;
  hasAuthenticated: boolean;
  setIsOpen: (open: boolean) => void;
  setHasAuthenticated: (authenticated: boolean) => void;
}

const useAuthModalStore = create<AuthModalStore>()(
  persist(
    (set) => ({
      isOpen: false,
      hasAuthenticated: false,
      setIsOpen: (open) => set({ isOpen: open }),
      setHasAuthenticated: (authenticated) => set({ hasAuthenticated: authenticated }),
    }),
    {
      name: 'auth-store',
    }
  )
);

export default useAuthModalStore;