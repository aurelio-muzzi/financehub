import { create } from 'zustand';

export type Theme = 'light' | 'dark';

interface UiState {
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  theme: Theme;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (isOpen: boolean) => void;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

function applyThemeToDom(theme: Theme) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  try {
    const stored = localStorage.getItem('financehub_theme');
    if (stored === 'dark' || stored === 'light') {
      applyThemeToDom(stored);
      return stored;
    }
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const initial = prefersDark ? 'dark' : 'light';
    applyThemeToDom(initial);
    return initial;
  } catch {
    return 'light';
  }
}

export const useUiStore = create<UiState>(set => {
  const initialTheme = getInitialTheme();

  return {
    isSidebarOpen: true,
    isMobileMenuOpen: false,
    theme: initialTheme,
    toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),
    setSidebarOpen: isOpen => set({ isSidebarOpen: isOpen }),
    toggleMobileMenu: () => set(state => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
    setMobileMenuOpen: isOpen => set({ isMobileMenuOpen: isOpen }),
    toggleTheme: () =>
      set(state => {
        const nextTheme: Theme = state.theme === 'dark' ? 'light' : 'dark';
        applyThemeToDom(nextTheme);
        try {
          localStorage.setItem('financehub_theme', nextTheme);
        } catch {
          // ignore
        }
        return { theme: nextTheme };
      }),
    setTheme: (theme: Theme) => {
      applyThemeToDom(theme);
      try {
        localStorage.setItem('financehub_theme', theme);
      } catch {
        // ignore
      }
      set({ theme });
    },
  };
});
