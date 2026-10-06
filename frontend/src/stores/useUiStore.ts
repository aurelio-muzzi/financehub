import { create } from 'zustand';

interface UiState {
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (isOpen: boolean) => void;
}

export const useUiStore = create<UiState>(set => ({
  isSidebarOpen: true,
  isMobileMenuOpen: false,
  toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: isOpen => set({ isSidebarOpen: isOpen }),
  toggleMobileMenu: () => set(state => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  setMobileMenuOpen: isOpen => set({ isMobileMenuOpen: isOpen }),
}));
