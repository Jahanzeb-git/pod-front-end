export const config = {
  api: {
    baseUrl: process.env.NODE_ENV === 'production' 
      ? 'https://your-api-domain.com' 
      : 'http://localhost:8000',
    version: 'v1'
  }
};

export const API_ENDPOINTS = {
  auth: {
    emailSignup: '/auth/email/signup',
    emailLogin: '/auth/email/login',
    googleAuth: '/auth/google',
    facebookAuth: '/auth/facebook',
    refresh: '/auth/refresh',
    logout: '/auth/logout'
  }
};