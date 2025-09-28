// Application Configuration
export const config = {
  // Backend Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
    version: 'v1'
  },
  
  // OAuth Configuration
  oauth: {
    google: {
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id',
    },
    facebook: {
      appId: import.meta.env.VITE_FACEBOOK_APP_ID || 'your-facebook-app-id',
    }
  },
  
  // App Configuration
  app: {
    name: 'PrintCraft AI',
    version: '1.0.0'
  }
} as const;

export const API_ENDPOINTS = {
  auth: {
    emailSignup: '/auth/email/signup',
    emailLogin: '/auth/email/login',
    googleAuth: '/auth/google',
    facebookAuth: '/auth/facebook',
    refresh: '/auth/refresh',
    logout: '/auth/logout'
  }
} as const;