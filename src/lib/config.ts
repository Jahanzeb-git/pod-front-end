import { PUBLIC_API_BASE_URL, PUBLIC_APP_URL, PUBLIC_GOOGLE_CLIENT_ID, PUBLIC_FACEBOOK_APP_ID } from '$env/static/public';

export const config = {
  api: {
    baseUrl: PUBLIC_API_BASE_URL || 'http://localhost:8000',
    version: 'v1'
  },
  auth: {
    googleClientId: PUBLIC_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
    facebookAppId: PUBLIC_FACEBOOK_APP_ID || 'YOUR_FACEBOOK_APP_ID',
    tokenRefreshBuffer: 30, // seconds before expiry to refresh
    sessionCheckInterval: 60, // seconds between session checks
  },
  app: {
    name: 'PrintCraft AI',
    tagline: 'Design & Print Your Ideas',
    description: 'AI-powered custom printing that turns your imagination into reality',
    supportEmail: 'support@printcraft.ai',
    frontendUrl: PUBLIC_APP_URL || 'http://localhost:5173'
  }
};

export const API_ENDPOINTS = {
  auth: {
    // Passwordless email endpoints
    emailInitiate: '/auth/email/initiate',
    emailVerify: '/auth/email/verify',
    
    // OAuth endpoints
    googleAuth: '/auth/google',
    facebookAuth: '/auth/facebook',
    
    // Session management
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    
    // User management
    profile: '/auth/profile',
    updateProfile: '/auth/profile/update'
  },
  products: {
    list: '/products',
    details: '/products/:id',
    categories: '/products/categories',
    search: '/products/search'
  },
  design: {
    generate: '/design/generate',
    save: '/design/save',
    list: '/design/list',
    get: '/design/:id',
    delete: '/design/:id'
  },
  orders: {
    create: '/orders/create',
    list: '/orders',
    details: '/orders/:id',
    cancel: '/orders/:id/cancel',
    track: '/orders/:id/track'
  },
  ai: {
    chat: '/ai/chat',
    suggestions: '/ai/suggestions',
    enhance: '/ai/enhance'
  }
};

// Feature flags
export const FEATURES = {
  enableGoogleAuth: true,
  enableFacebookAuth: true,
  enableEmailAuth: true,
  enableAIChat: true,
  enableDesignHistory: true,
  maintenanceMode: false
};

// Design constraints
export const DESIGN_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  supportedFormats: ['jpg', 'jpeg', 'png', 'svg', 'webp'],
  minResolution: 300, // DPI
  maxDesignsPerUser: 100,
  aiGenerationTimeout: 30000 // 30 seconds
};

// Pagination defaults
export const PAGINATION = {
  defaultPageSize: 20,
  maxPageSize: 100
};