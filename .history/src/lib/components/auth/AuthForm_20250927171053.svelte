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
    <!-- Social Auth Buttons -->
    <div class="social-buttons">
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
    </div>
    
    <div class="divider-fancy">
      <span>or</span>
    </div>
    
    <form on:submit|preventDefault={() => dispatch('emailAuth')}>
      <div class="email-input-group">
        <div class="email-input-wrapper">
          <Mail size={18} class="email-icon" />
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
        >
          {#if loading}
            <div class="spinner"></div>
          {:else}
            Continue with Email
            <ArrowRight size={18} />
          {/if}
        </button>
      </div>
      
      {#if error}
        <div class="error-alert">
          {error}
        </div>
      {/if}
    </form>
    
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
    padding: 2.5rem;
    border-radius: var(--radius-3xl);
    box-shadow: var(--shadow-xl);
    border: 1px solid var(--color-border-primary);
    backdrop-filter: blur(20px);
    position: relative;
  }

  .auth-form::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--color-bg-glass);
    border-radius: var(--radius-3xl);
    z-index: -1;
  }
  
  .social-buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .btn-social {
    width: 100%;
    padding: 1rem 1.5rem;
    border-radius: var(--radius-2xl);
    font-weight: 500;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.875rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    border: 2px solid var(--color-border-primary);
    background: transparent;
    position: relative;
    overflow: hidden;
  }

  .btn-social::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    transition: left 0.5s;
  }

  .btn-social:hover::before {
    left: 100%;
  }
  
  .btn-google {
    color: var(--color-text-primary);
  }
  
  .btn-google:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    border-color: var(--color-primary-400);
    background: var(--color-bg-secondary);
  }
  
  .btn-facebook {
    color: #1877f2;
    border-color: #1877f2;
  }

  [data-theme="dark"] .btn-facebook {
    color: #4dabf7;
    border-color: #4dabf7;
  }
  
  .btn-facebook:hover:not(:disabled) {
    background: #1877f2;
    color: white;
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  [data-theme="dark"] .btn-facebook:hover:not(:disabled) {
    background: #4dabf7;
    color: white;
  }

  .btn-social:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  .divider-fancy {
    position: relative;
    text-align: center;
    margin: 2rem 0;
  }
  
  .divider-fancy::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, var(--color-border-primary), transparent);
  }
  
  .divider-fancy span {
    position: relative;
    background: var(--color-bg-elevated);
    padding: 0 1.5rem;
    color: var(--color-text-tertiary);
    font-size: 0.875rem;
    font-weight: 600;
    letter-spacing: 0.5px;
  }
  
  .email-input-group {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
  
  .email-input-wrapper {
    position: relative;
  }
  
  .email-icon {
    position: absolute;
    left: 1.25rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-text-tertiary);
    transition: color 0.2s ease;
    z-index: 2;
  }
  
  .email-input {
    width: 100%;
    padding: 1.125rem 1.25rem 1.125rem 3.25rem;
    border: 2px solid var(--color-border-primary);
    border-radius: var(--radius-2xl);
    font-size: 1rem;
    background: transparent;
    color: var(--color-text-primary);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-weight: 500;
  }
  
  .email-input:focus {
    outline: none;
    border-color: var(--color-primary-500);
    box-shadow: 0 0 0 3px rgba(225, 29, 72, 0.1), var(--shadow-md);
    background: var(--color-bg-secondary);
  }

  .email-input:focus + .email-icon,
  .email-input-wrapper:focus-within .email-icon {
    color: var(--color-primary-500);
  }

  .email-input::placeholder {
    color: var(--color-text-tertiary);
    font-weight: 400;
  }
  
  .btn-primary {
    width: 100%;
    padding: 1.125rem 1.5rem;
    background: linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-600) 100%);
    color: white;
    border: none;
    border-radius: var(--radius-2xl);
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    position: relative;
    overflow: hidden;
  }

  .btn-primary::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.6s;
  }

  .btn-primary:hover::before {
    left: 100%;
  }
  
  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-xl);
    background: linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-700) 100%);
  }
  
  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
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
    padding: 1rem 1.25rem;
    background: var(--color-error-50);
    color: var(--color-error-600);
    border-radius: var(--radius-xl);
    font-size: 0.9rem;
    margin-top: 1rem;
    border: 1px solid rgba(239, 68, 68, 0.2);
    font-weight: 500;
    animation: slideInUp 0.3s ease;
  }

  [data-theme="dark"] .error-alert {
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.3);
    color: var(--color-error-400);
  }
  
  .auth-terms {
    margin-top: 2rem;
    text-align: center;
    font-size: 0.875rem;
    color: var(--color-text-tertiary);
    line-height: 1.5;
  }
  
  .link {
    color: var(--color-primary-600);
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s ease;
  }
  
  .link:hover {
    color: var(--color-primary-700);
    text-decoration: underline;
  }

  [data-theme="dark"] .link {
    color: var(--color-primary-400);
  }

  [data-theme="dark"] .link:hover {
    color: var(--color-primary-300);
  }
  
  .email-sent-card {
    text-align: center;
    padding: 3rem 2.5rem;
    background: var(--color-bg-elevated);
    border-radius: var(--radius-3xl);
    box-shadow: var(--shadow-xl);
    border: 1px solid var(--color-border-primary);
    animation: scaleIn 0.4s ease;
  }
  
  .success-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 2rem;
    background: linear-gradient(135deg, var(--color-success-50) 0%, var(--color-success-100) 100%);
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-success-600);
    border: 4px solid var(--color-success-200);
    animation: bounceIn 0.6s ease 0.2s both;
  }

  [data-theme="dark"] .success-icon {
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.2) 100%);
    border-color: rgba(34, 197, 94, 0.3);
  }
  
  .email-sent-card h3 {
    font-size: 1.75rem;
    margin-bottom: 0.75rem;
    color: var(--color-text-primary);
    font-weight: 700;
  }
  
  .email-sent-card p {
    color: var(--color-text-secondary);
    margin-bottom: 0.75rem;
    font-size: 1.05rem;
  }
  
  .email-hint {
    font-size: 0.95rem;
    color: var(--color-text-tertiary);
    margin-bottom: 2rem;
    line-height: 1.5;
  }

  .btn-secondary {
    padding: 0.875rem 2rem;
    background: transparent;
    color: var(--color-primary-600);
    border: 2px solid var(--color-primary-600);
    border-radius: var(--radius-2xl);
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .btn-secondary:hover {
    background: var(--color-primary-600);
    color: white;
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  [data-theme="dark"] .btn-secondary {
    color: var(--color-primary-400);
    border-color: var(--color-primary-400);
  }

  [data-theme="dark"] .btn-secondary:hover {
    background: var(--color-primary-400);
    color: var(--color-text-inverse);
  }

  /* Mobile responsiveness */
  @media (max-width: 480px) {
    .auth-form {
      padding: 2rem;
      border-radius: var(--radius-2xl);
    }

    .email-sent-card {
      padding: 2rem 1.5rem;
      border-radius: var(--radius-2xl);
    }

    .btn-social {
      padding: 1rem;
      font-size: 0.9rem;
    }

    .email-input {
      padding: 1rem 1rem 1rem 3rem;
    }

    .btn-primary {
      padding: 1rem 1.25rem;
    }

    .success-icon {
      width: 64px;
      height: 64px;
    }

    .email-sent-card h3 {
      font-size: 1.5rem;
    }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes bounceIn {
    0% {
      opacity: 0;
      transform: scale(0.3);
    }
    50% {
      opacity: 1;
      transform: scale(1.05);
    }
    70% {
      transform: scale(0.9);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
</style>