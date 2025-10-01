import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

function createThemeStore() {
  // Get initial theme from the <html> element, which is set by the blocking script in app.html
  const getInitialTheme = (): Theme => {
    if (!browser) return 'light'; // Default for server-side
    return document.documentElement.getAttribute('data-theme') as Theme || 'light';
  };

  const { subscribe, set } = writable<Theme>(getInitialTheme());

  return {
    subscribe,
    
    // Initialize listener for system theme changes
    init: () => {
      if (!browser) return () => {};
      
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const updateTheme = () => {
        const newTheme = mediaQuery.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        set(newTheme);
      };
      
      // Listen for system theme changes
      mediaQuery.addEventListener('change', updateTheme);
      
      // Return cleanup function
      return () => mediaQuery.removeEventListener('change', updateTheme);
    }
  };
}

export const themeStore = createThemeStore();