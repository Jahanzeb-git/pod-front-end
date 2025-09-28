<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Mail, ArrowRight, Check } from 'lucide-svelte';
  import { sdkReady } from '$lib/stores/sdk';

  export let email: string;
  export let loading: boolean;
  export let error: string;
  export let emailSent: boolean;
  export let hasRefreshToken: boolean;

  const dispatch = createEventDispatcher();
</script>

{#if !emailSent}
  <div class="auth-form">
    <button 
      class="btn-social btn-google" 
      on:click={() => dispatch('googleAuth')}
      disabled={loading || !$sdkReady.google}
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
      class="btn-social btn-facebook" 
      on:click={() => dispatch('facebookAuth')}
      disabled={loading || !$sdkReady.facebook}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
      Continue with Facebook
    </button>

    <div class="divider-fancy">
      <span>or</span>
    </div>

    <div class="email-input-wrapper">
      <Mail size={20} class="email-icon" />
      <input
        type="email"
        placeholder="Enter your email address"
        bind:value={email}
        class="email-input"
        disabled={loading}
        required
      />
    </div>

    <button 
      type="submit" 
      class="btn-primary"
      disabled={loading || !email}
      on:click={() => dispatch('emailAuth')}
    >
      {#if loading}
        <div class="spinner"></div>
      {:else}
        {hasRefreshToken ? 'Sign In' : 'Continue with Email'}
        <ArrowRight size={18} />
      {/if}
    </button>
    
    {#if error}
      <div class="error-alert">
        {error}
      </div>
    {/if}

    <p class="auth-terms">
      By continuing, you agree to our 
      <a href="/terms" class="link">Terms of Service</a> and 
      <a href="/privacy" class="link">Privacy Policy</a>
    </p>
  </div>
{:else}
  <div class="email-sent-card">
    <div class="success-icon">
      <Check size={32} />
    </div>
    <h3>Check your email!</h3>
    <p>We've sent a magic link to <strong>{email}</strong></p>
    <p class="email-hint">Click the link in the email to sign in instantly. No password needed!</p>
    <button 
      class="btn-secondary"
      on:click={() => dispatch('reset')}
    >
      Try another email
    </button>
  </div>
{/if}

<style>
  .auth-form {
    background: var(--color-bg-elevated);
    padding: 2rem;
    border-radius: var(--radius-2xl);
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--color-border-primary);
    display: flex;
    flex-direction: column;
    gap: 0.75rem; /* Consistent gap between all form elements */
  }
  
  .btn-social {
    padding: calc(0.875rem - 1px) calc(1.5rem - 1px); /* Adjust padding to account for 2px border */
    border-radius: var(--radius-xl);
    font-weight: 500;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    transition: all 0.2s;
    cursor: pointer;
    border: 2px solid var(--color-border-secondary);
    background-color: transparent;
    color: var(--color-text-secondary);
  }
  
  .btn-google:hover:not(:disabled) {
    border-color: #4285f4;
    background-color: rgba(66, 133, 244, 0.05);
    color: #4285f4;
  }
  
  .btn-facebook:hover:not(:disabled) {
    border-color: #1877f2;
    background-color: rgba(24, 119, 242, 0.05);
    color: #1877f2;
  }
  
  .divider-fancy {
    position: relative;
    text-align: center;
    margin: 0.75rem 0;
  }
  
  .divider-fancy::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--color-border-primary);
  }
  
  .divider-fancy span {
    position: relative;
    background: var(--color-bg-elevated);
    padding: 0 1rem;
    color: var(--color-text-tertiary);
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  /* Bulletproof Flexbox-based Input w/ Icon */
  .email-input-wrapper {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0 1.25rem;
    border: 2px solid var(--color-border-primary);
    border-radius: var(--radius-xl);
    background: var(--color-bg-primary);
    transition: all 0.2s;
  }

  .email-input-wrapper:focus-within {
    border-color: var(--color-primary-500);
    box-shadow: 0 0 0 3px rgba(225, 29, 72, 0.1);
  }
  
  .email-icon {
    color: var(--color-text-tertiary);
    flex-shrink: 0;
    transition: color 0.2s;
  }

  .email-input-wrapper:focus-within .email-icon {
    color: var(--color-primary-500);
  }
  
  .email-input {
    width: 100%;
    flex-grow: 1;
    border: none;
    outline: none;
    background: transparent;
    padding: 1rem 0;
    font-size: 1rem;
    color: var(--color-text-primary);
  }
  
  .btn-primary {
    width: 100%;
    padding: 1rem 1.5rem;
    background: linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-600) 100%);
    color: white;
    border: none;
    border-radius: var(--radius-xl);
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  
  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
  
  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  .error-alert {
    padding: 0.75rem 1rem;
    background: var(--color-error-50);
    color: var(--color-error-600);
    border-radius: var(--radius-lg);
    font-size: 0.9rem;
    border: 1px solid rgba(239, 68, 68, 0.2);
  }
  
  .auth-terms {
    text-align: center;
    font-size: 0.875rem;
    color: var(--color-text-tertiary);
  }
  
  .link {
    color: var(--color-primary-600);
    text-decoration: none;
    font-weight: 500;
  }
  
  .link:hover {
    text-decoration: underline;
  }
  
  .email-sent-card {
    text-align: center;
    padding: 2rem;
    background: var(--color-bg-elevated);
    border-radius: var(--radius-2xl);
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--color-border-primary);
  }
  
  .success-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 1.5rem;
    background: var(--color-success-50);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-success-600);
  }
  
  .email-sent-card h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: var(--color-text-primary);
  }
  
  .email-sent-card p {
    color: var(--color-text-secondary);
    margin-bottom: 0.5rem;
  }
  
  .email-hint {
    font-size: 0.9rem;
    color: var(--color-text-tertiary);
    margin-bottom: 1.5rem;
  }

  .btn-secondary {
    padding: 0.75rem 1.5rem;
    background: transparent;
    color: var(--color-primary-600);
    border: 2px solid var(--color-primary-600);
    border-radius: var(--radius-xl);
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .btn-secondary:hover {
    background: var(--color-primary-600);
    color: white;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>