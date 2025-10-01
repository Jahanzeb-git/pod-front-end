import { config, API_ENDPOINTS } from '$lib/config';
import { authStore } from '$lib/stores/auth';
import { get } from 'svelte/store';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${config.api.baseUrl}/api/${config.api.version}`;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const auth = get(authStore);

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add auth header if available
    if (auth.accessToken) {
      headers.Authorization = `Bearer ${auth.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', // Important for refresh token cookie
      });

      // Handle token refresh on 401
      if (response.status === 401 && auth.accessToken) {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry original request with new token
          const newAuth = get(authStore);
          headers.Authorization = `Bearer ${newAuth.accessToken}`;
          const retryResponse = await fetch(url, {
            ...options,
            headers,
            credentials: 'include',
          });
          return this.handleResponse<T>(retryResponse);
        } else {
          // Refresh failed, clear auth and redirect to login
          authStore.clearAuth();
          throw new Error('Session expired');
        }
      }

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }

    return response.text() as unknown as T;
  }

  // Passwordless Email Authentication
  async initiateEmailAuth(email: string) {
    return this.request('/auth/email/initiate', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Refresh Token
  async refreshToken(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Update the auth store with new access token
        const auth = get(authStore);
        if (data.access_token) {
          // If user data is included, update it
          if (data.user) {
            authStore.setAuth(data.user, data.access_token);
          } else if (auth.user) {
            // Keep existing user data, just update token
            authStore.setAuth(auth.user, data.access_token);
          }
          return data;
        }
      }
      return null;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  }

  // Google OAuth
  async googleAuth(authCode: string) {
    return this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ auth_code: authCode }),
    });
  }

  // Facebook OAuth
  async facebookAuth(authCode: string, redirectUri: string) {
    return this.request('/auth/facebook', {
      method: 'POST',
      body: JSON.stringify({ 
        auth_code: authCode,
        redirect_uri: redirectUri 
      }),
    });
  }

  // Logout
  async logout() {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      authStore.clearAuth();
    }
  }

  // Generic methods for future use
  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, data?: any) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  put<T>(endpoint: string, data?: any) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  patch<T>(endpoint: string, data?: any) {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
  
  // Product Selection
  async submitProductSelection(productData: any, userSelection: any) {
    return this.request('/product/select', {
      method: 'POST',
      body: JSON.stringify({
        product: productData,
        user_selection: userSelection
      }),
    });
  }
}

export const apiClient = new ApiClient();