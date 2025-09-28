import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  profile_picture?: string;
  provider?: string;
  is_verified?: boolean;
  created_at?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  tokenExpiresAt: number | null;
}

// Token expiry helper
function getTokenExpiry(expiresIn?: number): number | null {
  if (!expiresIn) return null;
  return Date.now() + (expiresIn * 1000);
}

// Check if token is expired
function isTokenExpired(expiresAt: number | null): boolean {
  if (!expiresAt) return true;
  // Add 30 second buffer to refresh slightly before expiry
  return Date.now() >= (expiresAt - 30000);
}

// Create the auth store
function createAuthStore() {
  const initialState: AuthState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    tokenExpiresAt: null
  };

  // Load from localStorage if available (for persistence)
  if (browser) {
    try {
      const stored = localStorage.getItem('auth_state');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Check if token is still valid
        if (parsed.accessToken && !isTokenExpired(parsed.tokenExpiresAt)) {
          initialState.user = parsed.user;
          initialState.accessToken = parsed.accessToken;
          initialState.isAuthenticated = true;
          initialState.tokenExpiresAt = parsed.tokenExpiresAt;
        }
      }
    } catch (e) {
      console.error('Failed to load auth state from storage:', e);
    }
  }

  const { subscribe, set, update } = writable<AuthState>(initialState);

  // Persist to localStorage on changes
  const persistState = (state: AuthState) => {
    if (browser) {
      try {
        if (state.isAuthenticated) {
          localStorage.setItem('auth_state', JSON.stringify({
            user: state.user,
            accessToken: state.accessToken,
            tokenExpiresAt: state.tokenExpiresAt
          }));
        } else {
          localStorage.removeItem('auth_state');
        }
      } catch (e) {
        console.error('Failed to persist auth state:', e);
      }
    }
  };

  return {
    subscribe,
    
    // Set authentication data
    setAuth: (user: User, accessToken: string, expiresIn: number = 1800) => {
      const newState = {
        user,
        accessToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        tokenExpiresAt: getTokenExpiry(expiresIn)
      };
      set(newState);
      persistState(newState);
    },
    
    // Clear authentication data
    clearAuth: () => {
      const newState = {
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        tokenExpiresAt: null
      };
      set(newState);
      persistState(newState);
    },
    
    // Set loading state
    setLoading: (isLoading: boolean) => {
      update(state => ({ ...state, isLoading }));
    },
    
    // Set error state
    setError: (error: string | null) => {
      update(state => ({ ...state, error }));
    },
    
    // Update user data
    updateUser: (userData: Partial<User>) => {
      update(state => {
        const newState = {
          ...state,
          user: state.user ? { ...state.user, ...userData } : null
        };
        persistState(newState);
        return newState;
      });
    },
    
    // Update access token
    updateToken: (accessToken: string, expiresIn: number = 1800) => {
      update(state => {
        const newState = {
          ...state,
          accessToken,
          tokenExpiresAt: getTokenExpiry(expiresIn)
        };
        persistState(newState);
        return newState;
      });
    },
    
    // Check if token needs refresh
    needsRefresh: (): boolean => {
      const state = get({ subscribe });
      return isTokenExpired(state.tokenExpiresAt);
    },
    
    // Initialize auth (check for existing session)
    initialize: async () => {
      if (!browser) return;
      
      const state = get({ subscribe });
      
      // If we have a token but it's expired, try to refresh
      if (state.accessToken && isTokenExpired(state.tokenExpiresAt)) {
        update(s => ({ ...s, isLoading: true }));
        
        try {
          const { apiClient } = await import('$lib/api/client');
          const response = await apiClient.refreshToken();
          
          if (response && response.access_token) {
            const newState = {
              user: response.user || state.user,
              accessToken: response.access_token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
              tokenExpiresAt: getTokenExpiry(response.expires_in)
            };
            set(newState);
            persistState(newState);
          } else {
            // Refresh failed, clear auth
            const clearedState = {
              user: null,
              accessToken: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
              tokenExpiresAt: null
            };
            set(clearedState);
            persistState(clearedState);
          }
        } catch (error) {
          console.error('Failed to refresh token:', error);
          const clearedState = {
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: 'Session expired',
            tokenExpiresAt: null
          };
          set(clearedState);
          persistState(clearedState);
        }
      }
    }
  };
}

export const authStore = createAuthStore();

// Derived stores for convenience
export const user = derived(authStore, $auth => $auth.user);
export const isAuthenticated = derived(authStore, $auth => $auth.isAuthenticated);
export const isLoading = derived(authStore, $auth => $auth.isLoading);
export const authError = derived(authStore, $auth => $auth.error);

// Auto-refresh token before expiry
if (browser) {
  setInterval(() => {
    const state = get(authStore);
    if (state.isAuthenticated && isTokenExpired(state.tokenExpiresAt)) {
      authStore.initialize();
    }
  }, 60000); // Check every minute
}

// Helper function to get the store state synchronously
function get<T>(store: { subscribe: (callback: (value: T) => void) => () => void }): T {
  let value: T;
  store.subscribe(v => value = v)();
  return value!;
}