import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Create the auth store
function createAuthStore() {
  const initialState: AuthState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: false
  };

  const { subscribe, set, update } = writable<AuthState>(initialState);

  return {
    subscribe,
    
    // Set authentication data
    setAuth: (user: User, accessToken: string) => {
      update(state => ({
        ...state,
        user,
        accessToken,
        isAuthenticated: true,
        isLoading: false
      }));
    },
    
    // Clear authentication data
    clearAuth: () => {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false
      });
    },
    
    // Set loading state
    setLoading: (isLoading: boolean) => {
      update(state => ({ ...state, isLoading }));
    },
    
    // Update user data
    updateUser: (userData: Partial<User>) => {
      update(state => ({
        ...state,
        user: state.user ? { ...state.user, ...userData } : null
      }));
    }
  };
}

export const authStore = createAuthStore();

// Derived stores for convenience
export const user = derived(authStore, $auth => $auth.user);
export const isAuthenticated = derived(authStore, $auth => $auth.isAuthenticated);
export const isLoading = derived(authStore, $auth => $auth.isLoading);