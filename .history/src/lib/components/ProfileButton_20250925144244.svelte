<script lang="ts">
  import { user, isAuthenticated } from '$lib/stores/auth';
  import { UserPlus, User } from 'lucide-svelte';
  
  export let onClick: () => void;
  
  let imageError = false;
  
  function handleImageError() {
    imageError = true;
  }
  
  function getInitials(firstName?: string, email?: string): string {
    if (firstName) {
      return firstName.charAt(0).toUpperCase();
    }
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    return 'U';
  }
</script>

<button 
  class="profile-button"
  on:click={onClick}
  aria-label={$isAuthenticated ? 'Open profile menu' : 'Sign up / Sign in'}
>
  {#if $isAuthenticated && $user}
    <!-- Authenticated User -->
    <div class="profile-avatar authenticated">
      {#if $user.avatar_url && !imageError}
        <img 
          src={$user.avatar_url} 
          alt={$user.first_name || $user.email} 
          on:error={handleImageError}
          loading="lazy"
        />
      {:else}
        <div class="avatar-initials">
          {getInitials($user.first_name, $user.email)}
        </div>
      {/if}
    </div>
  {:else}
    <!-- Unauthenticated User -->
    <div class="profile-avatar unauthenticated">
      <UserPlus size={20} class="signup-icon" />
    </div>
  {/if}
</button>

<style>
  .profile-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background-color: transparent;
    border: 2px solid var(--color-border-primary);
    border-radius: var(--radius-full);
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    color: var(--color-text-primary);
    position: relative;
    overflow: hidden;
  }
  
  .profile-button:hover {
    border-color: var(--color-interactive-primary);
    transform: scale(1.05);
    box-shadow: var(--shadow-md);
  }
  
  .profile-avatar {
    width: 100%;
    height: 100%;
    border-radius: var(--radius-full);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  
  /* Authenticated state */
  .profile-avatar.authenticated {
    background: linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-600) 100%);
  }
  
  .profile-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .avatar-initials {
    color: white;
    font-weight: 700;
    font-size: 1rem;
    text-transform: uppercase;
  }
  
  /* Unauthenticated state */
  .profile-avatar.unauthenticated {
    background-color: var(--color-interactive-secondary);
    transition: background-color 0.2s ease;
  }
  
  .profile-button:hover .profile-avatar.unauthenticated {
    background-color: var(--color-interactive-primary);
  }
  
  .profile-button:hover :global(.signup-icon) {
    color: white;
  }
  
  :global(.signup-icon) {
    color: var(--color-text-tertiary);
    transition: color 0.2s ease;
  }
  
  /* Online indicator for authenticated users */
  .profile-avatar.authenticated::after {
    content: '';
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 12px;
    height: 12px;
    background-color: var(--color-success-500);
    border: 2px solid var(--color-bg-elevated);
    border-radius: var(--radius-full);
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
      transform: scale(1.1);
    }
  }
  
  /* Focus states */
  .profile-button:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgb(225 29 72 / 0.2);
  }
  
  /* Mobile touch improvements */
  @media (hover: none) and (pointer: coarse) {
    .profile-button:hover {
      transform: none;
    }
    
    .profile-button:active {
      transform: scale(0.95);
    }
  }
</style>