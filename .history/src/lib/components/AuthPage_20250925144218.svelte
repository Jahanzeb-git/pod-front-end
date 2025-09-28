<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { authStore } from '$lib/stores/auth';
  import { apiClient } from '$lib/api/client';
  import { Mail, Lock, User, Eye, EyeOff } from 'lucide-svelte';
  
  const dispatch = createEventDispatcher();
  
  let mode: 'signin' | 'signup' = 'signin';
  let email = '';
  let password = '';
  let firstName = '';
  let lastName = '';
  let showPassword = false;
  let error = '';
  let loading = false;
  
  function closeAuth() {
    dispatch('close');
  }
  
  function switchMode() {
    mode = mode === 'signin' ? 'signup' : 'signin';
    error = '';
    // Clear form
    email = '';
    password = '';
    firstName = '';
    lastName = '';
  }
  
  async function handleEmailAuth() {
    if (!email || !password) {
      error = 'Please fill in all required fields';
      return;
    }
    
    if (mode === 'signup' && (!firstName || !lastName)) {
      error = 'Please fill in your name';
      return;
    }
    
    loading = true;
    error = '';
    authStore.setLoading(true);
    
    try {
      let response;
      if (mode === 'signup') {
        response = await apiClient.emailSignup(email, password, firstName, lastName);
      } else {
        response = await apiClient.emailLogin(email, password);
      }
      
      authStore.setAuth(response.user, response.access_token);
      closeAuth();
    } catch (err: any) {
      error = err.message || 'Authentication failed';
    } finally {
      loading = false;
      authStore.setLoading(false);
    }
  }
  
  async function handleGoogleAuth() {
    loading = true;
    error = '';
    authStore.setLoading(true);
    
    try {
      // Initialize Google Auth
      if (typeof window !== 'undefined' && window.google) {
        window.google.accounts.oauth2.initCodeClient({
          client_id: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your client ID
          scope: 'email profile',
          ux_mode: 'popup',
          callback: async (response: any) => {
            try {
              const authResult = await apiClient.googleAuth(response.code);
              authStore.setAuth(authResult.user, authResult.access_token);
              closeAuth();
            } catch (err: any) {
              error = err.message || 'Google authentication failed';
            } finally {
              loading = false;
              authStore.setLoading(false);
            }
          }
        }).requestCode();
      } else {
        error = 'Google authentication is not available';
        loading = false;
        authStore.setLoading(false);
      }
    } catch (err: any) {
      error = err.message || 'Google authentication failed';
      loading = false;
      authStore.setLoading(false);
    }
  }
  
  async function handleFacebookAuth() {
    loading = true;
    error = '';
    authStore.setLoading(true);
    
    try {
      // Initialize Facebook SDK
      if (typeof window !== 'undefined' && window.FB) {
        window.FB.login((response: any) => {
          if (response.authResponse) {
            // Handle Facebook auth code
            apiClient.facebookAuth(response.authResponse.code)
              .then((authResult) => {
                authStore.setAuth(authResult.user, authResult.access_token);
                closeAuth();
              })
              .catch((err) => {
                error = err.message || 'Facebook authentication failed';
              })
              .finally(() => {
                loading = false;
                authStore.setLoading(false);
              });
          } else {
            error = 'Facebook login was cancelled';
            loading = false;
            authStore.setLoading(false);
          }
        }, { scope: 'email,public_profile' });
      } else {
        error = 'Facebook authentication is not available';
        loading = false;
        authStore.setLoading(false);
      }
    } catch (err: any) {
      error = err.message || 'Facebook authentication failed';
      loading = false;
      authStore.setLoading(false);
    }
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeAuth();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="auth-page">
  <div class="auth-container">
    <!-- Header -->
    <div class="auth-header">
      <h1 class="auth-title">
        {mode === 'signin' ? 'Welcome back' : 'Join PrintCraft AI'}
      </h1>
      <p class="auth-subtitle">
        {mode === 'signin' 
          ? 'Sign in to continue creating amazing designs' 
          : 'Create your account and start designing'
        }
      </p>
    </div>
    
    <!-- Social Authentication -->
    <div class="social-auth">
      <button 
        class="btn btn-google social-btn" 
        on:click={handleGoogleAuth}
        disabled={loading}
      >
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>
      
      <button 
        class="btn btn-facebook social-btn" 
        on:click={handleFacebookAuth}
        disabled={loading}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        Continue with Facebook
      </button>
    </div>
    
    <div class="divider">
      <span class="divider-text">or</span>
    </div>
    
    <!-- Email Form -->
    <form class="email-form" on:submit|preventDefault={handleEmailAuth}>
      {#if mode === 'signup'}
        <div class="form-row">
          <div class="form-group">
            <div class="input-wrapper">
              <User size={18} class="input-icon" />
              <input
                type="text"
                placeholder="First name"
                bind:value={firstName}
                class="input"
                disabled={loading}
                required
              />
            </div>
          </div>
          <div class="form-group">
            <div class="input-wrapper">
              <User size={18} class="input-icon" />
              <input
                type="text"
                placeholder="Last name"
                bind:value={lastName}
                class="input"
                disabled={loading}
                required
              />
            </div>
          </div>
        </div>
      {/if}
      
      <div class="form-group">
        <div class="input-wrapper">
          <Mail size={18} class="input-icon" />
          <input
            type="email"
            placeholder="Email address"
            bind:value={email}
            class="input"
            required
            disabled={loading}
          />
        </div>
      </div>
      
      <div class="form-group">
        <div class="input-wrapper">
          <Lock size={18} class="input-icon" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            bind:value={password}
            class="input"
            required
            disabled={loading}
          />
          <button
            type="button"
            class="input-action"
            on:click={() => showPassword = !showPassword}
            disabled={loading}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {#if showPassword}
              <EyeOff size={18} />
            {:else}
              <Eye size={18} />
            {/if}
          </button>
        </div>
      </div>
      
      {#if error}
        <div class="error-message">
          {error}
        </div>
      {/if}
      
      <button 
        type="submit" 
        class="btn btn-primary auth-submit"
        disabled={loading || !email || !password || (mode === 'signup' && (!firstName || !lastName))}
      >
        {#if loading}
          <div class="loading-spinner"></div>
        {:else}
          {mode === 'signin' ? 'Sign in' : 'Create account'}
        {/if}
      </button>
    </form>
    
    <!-- Footer -->
    <div class="auth-footer">
      <p class="switch-mode">
        {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
        <button class="link-button" on:click={switchMode} disabled={loading}>
          {mode === 'signin' ? 'Sign up' : 'Sign in'}
        </button>
      </p>
    </div>
  </div>
</div>

<style>
  .auth-header {
    text-align: center;
    margin-bottom: var(--spacing-8);
  }
  
  .auth-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-2);
    letter-spacing: -0.025em;
  }
  
  .auth-subtitle {
    color: var(--color-text-secondary);
    font-size: 0.9rem;
    line-height: 1.5;
    font-weight: 400;
  }
  
  .social-auth {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
    margin-bottom: var(--spacing-6);
  }
  
  .social-btn {
    width: 100%;
    padding: var(--spacing-4) var(--spacing-6);
    font-weight: 500;
    justify-content: flex-start;
    gap: var(--spacing-3);
  }
  
  .btn-google:hover:not(:disabled) {
    background-color: var(--color-secondary-50);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }
  
  [data-theme="dark"] .btn-google:hover:not(:disabled) {
    background-color: var(--color-bg-tertiary);
  }
  
  .btn-facebook:hover:not(:disabled) {
    background-color: #166fe5;
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }
  
  .email-form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-5);
  }
  
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-4);
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
  }
  
  .auth-submit {
    width: 100%;
    padding: var(--spacing-4) var(--spacing-6);
    font-weight: 600;
    margin-top: var(--spacing-2);
    font-size: 0.9rem;
  }
  
  .auth-footer {
    margin-top: var(--spacing-8);
    text-align: center;
  }
  
  .switch-mode {
    color: var(--color-text-secondary);
    font-size: 0.875rem;
    font-weight: 400;
  }
  
  /* Mobile Responsiveness */
  @media (max-width: 480px) {
    .form-row {
      grid-template-columns: 1fr;
    }
    
    .auth-title {
      font-size: 1.5rem;
    }
    
    .social-btn {
      justify-content: center;
    }
  }
</style>