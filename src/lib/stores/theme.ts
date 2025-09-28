import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

function createThemeStore() {
  // Detect system theme
  const getSystemTheme = (): Theme => {
    if (!browser) return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const { subscribe, set } = writable<Theme>(getSystemTheme());

  return {
    subscribe,
    
    // Initialize theme detection
    init: () => {
      if (!browser) return;
      
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const updateTheme = () => set(mediaQuery.matches ? 'dark' : 'light');
      
      // Set initial theme
      updateTheme();
      
      // Listen for system theme changes
      mediaQuery.addEventListener('change', updateTheme);
      
      return () => mediaQuery.removeEventListener('change', updateTheme);
    }
  };
}

export const themeStore = createThemeStore();