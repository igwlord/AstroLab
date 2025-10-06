import { create } from 'zustand';

interface ThemeState {
  isDark: boolean;
  isAuto: boolean;
  
  // Actions
  toggleTheme: () => void;
  setDarkMode: (isDark: boolean) => void;
  setAutoMode: (isAuto: boolean) => void;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  isDark: false,
  isAuto: true,

  toggleTheme: () => {
    const { isDark } = get();
    const newIsDark = !isDark;
    
    set({ isDark: newIsDark, isAuto: false });
    
    // Apply to DOM
    document.documentElement.classList.toggle('dark', newIsDark);
    
    // Save to localStorage
    localStorage.setItem('astrolab-theme', newIsDark ? 'dark' : 'light');
  },

  setDarkMode: (isDark) => {
    set({ isDark, isAuto: false });
    
    // Apply to DOM
    document.documentElement.classList.toggle('dark', isDark);
    
    // Save to localStorage
    localStorage.setItem('astrolab-theme', isDark ? 'dark' : 'light');
  },

  setAutoMode: (isAuto) => {
    set({ isAuto });
    
    if (isAuto) {
      // Use system preference
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      set({ isDark: systemDark });
      document.documentElement.classList.toggle('dark', systemDark);
      localStorage.setItem('astrolab-theme', 'auto');
    }
  },

  initializeTheme: () => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('astrolab-theme');
    
    if (savedTheme === 'dark') {
      set({ isDark: true, isAuto: false });
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      set({ isDark: false, isAuto: false });
      document.documentElement.classList.remove('dark');
    } else {
      // Auto mode (default)
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      set({ isDark: systemDark, isAuto: true });
      document.documentElement.classList.toggle('dark', systemDark);
      
      // Listen for system theme changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const { isAuto } = get();
        if (isAuto) {
          set({ isDark: e.matches });
          document.documentElement.classList.toggle('dark', e.matches);
        }
      });
    }
  },
}));

// Initialize theme on store creation
useThemeStore.getState().initializeTheme();