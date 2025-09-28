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
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }

    return response.text() as unknown as T;
  }

  private async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.auth.refresh}`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        const auth = get(authStore);
        if (auth.user) {
          authStore.setAuth(auth.user, data.access_token);
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  }

  // Auth methods
  async emailSignup(email: string, password: string, firstName?: string, lastName?: string) {
    return this.request(API_ENDPOINTS.auth.emailSignup, {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      }),
    });
  }

  async emailLogin(email: string, password: string) {
    return this.request(API_ENDPOINTS.auth.emailLogin, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async googleAuth(authCode: string) {
    return this.request(API_ENDPOINTS.auth.googleAuth, {
      method: 'POST',
      body: JSON.stringify({ auth_code: authCode }),
    });
  }

  async facebookAuth(authCode: string) {
    return this.request(API_ENDPOINTS.auth.facebookAuth, {
      method: 'POST',
      body: JSON.stringify({ auth_code: authCode }),
    });
  }

  async logout() {
    return this.request(API_ENDPOINTS.auth.logout, {
      method: 'POST',
    });
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

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();