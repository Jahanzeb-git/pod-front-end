<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { apiClient } from '$lib/api/client';
  import { authStore } from '$lib/stores/auth';

  let loading = true;
  let error = '';

  onMount(async () => {
    const token = $page.url.searchParams.get('token');
    
    if (!token) {
      error = 'Invalid verification link';
      loading = false;
      return;
    }

    try {
      // The backend handles the verification and sets the refresh token cookie
      // We just need to get the access token
      const response = await apiClient.refreshToken();
      
      if (response && response.access_token) {
        authStore.setAuth(response.user || {}, response.access_token);
        await goto('/');
      } else {
        error = 'Verification failed. Please try again.';
      }
    } catch (err: any) {
      error = err.message || 'Verification failed';
    } finally {
      loading = false;
    }
  });
</script>

<div class="verify-container">
  {#if loading}
    <div class="loading">
      <div class="spinner"></div>
      <p>Verifying your email...</p>
    </div>
  {:else if error}
    <div class="error">
      <h2>Verification Failed</h2>
      <p>{error}</p>
      <a href="/auth" class="btn btn-primary">Back to Login</a>
    </div>
  {/if}
</div>

<style>
  .verify-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }
  
  .loading, .error {
    text-align: center;
    max-width: 400px;
  }
  
  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid var(--color-border-primary);
    border-top-color: var(--color-primary-500);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }
  
  .error h2 {
    color: var(--color-text-primary);
    margin-bottom: 1rem;
  }
  
  .error p {
    color: var(--color-text-secondary);
    margin-bottom: 2rem;
  }
</style>
