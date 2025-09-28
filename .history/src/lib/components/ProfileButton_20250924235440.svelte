<script lang="ts">
  import { user, isAuthenticated } from '$lib/stores/auth';
  import { User } from 'lucide-svelte';
  
  export let onClick: () => void;
  
  let imageError = false;
  
  function handleImageError() {
    imageError = true;
  }
</script>

<div 
  class="profile-icon-wrapper"
  on:click={onClick}
  role="button"
  tabindex="0"
  aria-label={$isAuthenticated ? 'Open profile menu' : 'Sign in'}
>
  <div class="profile-avatar">
    {#if $user?.avatar_url && !imageError}
      <img 
        src={$user.avatar_url} 
        alt={$user.first_name || 'User'} 
        on:error={handleImageError}
        loading="lazy"
      />
    {:else}
      <User size={20} class="profile-icon" style="color: {!$isAuthenticated ? 'var(--color-error-500)' : 'var(--color-text-tertiary)'};" />
    {/if}
  </div>
</div>

<style>
  .profile-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px; /* Reduced size to fit 5% sidebar */
    height: 32px; /* Reduced size to fit 5% sidebar */
    border-radius: var(--radius-full);
    cursor: pointer;
    transition: all 0.15s ease;
    background-color: var(--color-interactive-secondary);
    border: 1px solid var(--color-border-primary);
  }
  
  .profile-icon-wrapper:hover {
    background-color: var(--color-interactive-secondary-hover);
    border-color: var(--color-border-secondary);
    box-shadow: var(--shadow-sm);
  }
  
  .profile-avatar {
    width: 28px; /* Slightly smaller than wrapper to show border */
    height: 28px; /* Slightly smaller than wrapper to show border */
    border-radius: var(--radius-full);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  .profile-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  /* The color of the icon is now conditionally set inline */
</style>