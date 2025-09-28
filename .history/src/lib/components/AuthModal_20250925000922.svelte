<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { authStore, isLoading } from '$lib/stores/auth';
  import { apiClient } from '$lib/api/client';
  import GoogleIcon from '$lib/components/icons/GoogleIcon.svelte';
  import FacebookIcon from '$lib/components/icons/FacebookIcon.svelte';
  import EmailIcon from '$lib/components/icons/EmailIcon.svelte';
  import LockIcon from '$lib/components/icons/LockIcon.svelte';
  import EyeIcon from '$lib/components/icons/EyeIcon.svelte';
  
  const dispatch = createEventDispatcher();
  
  let mode: 'signin' | 'signup' = 'signin';
  let email = '';
  let password = '';
  let firstName = '';
  let lastName = '';
  let showPassword = false;
  let error = '';
  let loading = false;
  
  function closeModal() {
    dispatch('close');
  }
  
  function switchMode() {
    mode = mode === 'signin' ? 'signup' : 'signin';
    error = '';
  }
  
  async function handleEmailAuth() {
    if (!email || !password) {
      error = 'Please fill in all required fields';
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
      closeModal();
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
      // This is a placeholder for Google OAuth implementation
      // In a real app, you would use Google's OAuth library
      error = 'Google authentication will be implemented with proper OAuth setup';
    } catch (err: any) {
      error = err.message || 'Google authentication failed';
    } finally {
      loading = false;
      authStore.setLoading(false);
    }
  }
  
  async function handleFacebookAuth() {
    loading = true;
    error = '';
    authStore.setLoading(true);
    
    try {
      // This is a placeholder for Facebook OAuth implementation
      // In a real app, you would use Facebook's SDK
      error = 'Facebook authentication will be implemented with proper OAuth setup';
    } catch (err: any) {
      error = err.message || 'Facebook authentication failed';
    } finally {
      loading = false;
      authStore.setLoading(false);
    }
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="modal-overlay" on:click={closeModal}>
  <div class="modal-content auth-modal" on:click|stopPropagation>
    <div class="auth-header">
      <h2 class="auth-title">
        {mode === 'signin' ? 'Welcome back' : 'Create your account'}
      </h2>
      <p class="auth-subtitle">
        {mode === 'signin' 
          ? 'Sign in to continue to PrintCraft AI' 
          : 'Join PrintCraft AI to start creating amazing designs'
        }
      </p>
    </div>
    
    <div class="auth-content">
      <!-- Social Authentication -->
      <div class="social-auth">
        <button 
          class="btn btn-outline social-btn" 
          on:click={handleGoogleAuth}
          disabled={loading}
        >
          <GoogleIcon size={20} />
          Continue with Google
        </button>
        
        <button 
          class="btn btn-outline social-btn" 
          on:click={handleFacebookAuth}
          disabled={loading}
        >
          <FacebookIcon size={20} />
          Continue with Facebook
        </button>
      </div>
      
      <div class="divider">
        <span class="divider-text">or</span>
      </div>
      
      <!-- Email Authentication -->
      <form class="email-form" on:submit|preventDefault={handleEmailAuth}>
        {#if mode === 'signup'}
          <div class="form-row">
            <div class="form-group">
              <div class="input-wrapper">
                <input
                  type="text"
                  placeholder="First name"
                  bind:value={firstName}
                  class="input"
                  disabled={loading}
                />
              </div>
            </div>
            <div class="form-group">
              <div class="input-wrapper">
                <input
                  type="text"
                  placeholder="Last name"
                  bind:value={lastName}
                  class="input"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        {/if}
        
        <div class="form-group">
          <div class="input-wrapper">
            <EmailIcon size={18} className="input-icon" />
            <input
              type="email"
              placeholder="Email address"
              bind:value={email}
              class="input input-with-icon"
              required
              disabled={loading}
            />
          </div>
        </div>
        
        <div class="form-group">
          <div class="input-wrapper">
            <LockIcon size={18} className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              bind:value={password}
              class="input input-with-icon input-with-action"
              required
              disabled={loading}
            />
            <button
              type="button"
              class="input-action"
              on:click={() => showPassword = !showPassword}
              disabled={loading}
            >
              <EyeIcon size={18} closed={!showPassword} />
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
          disabled={loading || !email || !password}
        >
          {#if loading}
            <div class="loading-spinner"></div>
          {/if}
          {mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>
      </form>
      
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
</div>

<style>
  .auth-modal {
    width: 100%;
    max-width: 400px;
    padding: var(--spacing-8);
  }
  
  .auth-header {
    text-align: center;
    margin-bottom: var(--spacing-8);
  }
  
  .auth-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-2);
  }
  
  .auth-subtitle {
    color: var(--color-text-secondary);
    font-size: 0.875rem;
    line-height: 1.4;
  }
  
  .social-auth {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
    margin-bottom: var(--spacing-6);
  }
  
  .social-btn {
    width: 100%;
    padding: var(--spacing-4);
    font-weight: 500;
  }
  
  .divider {
    position: relative;
    margin: var(--spacing-6) 0;
    text-align: center;
  }
  
  .divider::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background-color: var(--color-border-primary);
  }
  
  .divider-text {
    background-color: var(--color-bg-elevated);
    padding: 0 var(--spacing-4);
    color: var(--color-text-tertiary);
    font-size: 0.875rem;
  }
  
  .email-form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-4);
  }
  
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-3);
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
  }
  
  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }
  
  .input-with-icon {
    padding-left: var(--spacing-10);
  }
  
  .input-with-action {
    padding-right: var(--spacing-10);
  }
  
  .input-icon {
    position: absolute;
    left: var(--spacing-3);
    color: var(--color-text-tertiary);
    pointer-events: none;
  }
  
  .input-action {
    position: absolute;
    right: var(--spacing-3);
    background: none;
    border: none;
    cursor: pointer;
    color: var(--color-text-tertiary);
    padding: var(--spacing-1);
    border-radius: var(--radius-sm);
    transition: color 0.15s ease;
  }
  
  .input-action:hover {
    color: var(--color-text-secondary);
  }
  
  .error-message {
    color: var(--color-error-500);
    font-size: 0.875rem;
    text-align: center;
    padding: var(--spacing-3);
    background-color: var(--color-error-50);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-error-500);
  }
  
  [data-theme="dark"] .error-message {
    background-color: rgb(239 68 68 / 0.1);
  }
  
  .auth-submit {
    width: 100%;
    padding: var(--spacing-4);
    font-weight: 600;
    margin-top: var(--spacing-2);
  }
  
  .auth-footer {
    margin-top: var(--spacing-6);
    text-align: center;
  }
  
  .switch-mode {
    color: var(--color-text-secondary);
    font-size: 0.875rem;
  }
  
  .link-button {
    background: none;
    border: none;
    color: var(--color-interactive-primary);
    cursor: pointer;
    font-weight: 500;
    text-decoration: none;
    margin-left: var(--spacing-1);
  }
  
  .link-button:hover {
    text-decoration: underline;
  }
  
  .link-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  /* Mobile Responsiveness */
  @media (max-width: 480px) {
    .auth-modal {
      max-width: 90vw;
      padding: var(--spacing-6);
    }
    
    .form-row {
      grid-template-columns: 1fr;
    }
  }
</style>