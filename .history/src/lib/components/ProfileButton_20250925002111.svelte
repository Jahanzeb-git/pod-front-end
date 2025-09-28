<script lang="ts">
  import { user, isAuthenticated } from '$lib/stores/auth';
  import UserIcon from '$lib/components/icons/UserIcon.svelte';
  
  export let onClick: () => void;
  
  let imageError = false;
  
  function handleImageError() {
    imageError = true;
  }
</script>

<button 
  class="profile-button"
  on:click={onClick}
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
      <UserIcon size={20} className="profile-icon" />
    {/if}
  </div>
  
  {#if $isAuthenticated && $user}
    <div class="profile-info">
      <span class="profile-name">
        {$user.first_name || $user.email.split('@')[0]}
      </span>
    </div>
  {/if}
</button>

<style>
  .profile-button {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    width: 100%;
    padding: var(--spacing-3);
    background-color: transparent;
    border: 1px solid var(--color-border-primary);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all 0.15s ease;
    color: var(--color-text-primary);
  }
  
  .profile-button:hover {
    background-color: var(--color-interactive-secondary);
    border-color: var(--color-border-secondary);
  }
  
  .profile-avatar {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-full);
    overflow: hidden;
    background-color: var(--color-interactive-secondary);
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
  
  .profile-avatar :global(.profile-icon) {
    color: var(--color-text-tertiary);
  }
  
  .profile-info {
    flex: 1;
    text-align: left;
    min-width: 0;
  }
  
  .profile-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>