<script lang="ts">
  import { onMount } from 'svelte';
  import { themeStore } from '$lib/stores/theme';
  import ProfileButton from '$lib/components/ProfileButton.svelte';
  import AuthModal from '$lib/components/AuthModal.svelte';
  import { isAuthenticated } from '$lib/stores/auth';
  import '../app.css';
  
  let showAuthModal = false;
  let currentTheme: 'light' | 'dark' = 'light';
  
  // Subscribe to theme changes
  themeStore.subscribe(theme => {
    currentTheme = theme;
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  });
  
  onMount(() => {
    // Initialize theme detection
    const cleanup = themeStore.init();
    return cleanup;
  });
  
  function handleProfileClick() {
    if (!$isAuthenticated) {
      showAuthModal = true;
    } else {
      // TODO: Show profile menu when implemented
      console.log('Profile menu will be implemented later');
    }
  }
  
  function closeAuthModal() {
    showAuthModal = false;
  }
</script>

<svelte:head>
  <title>PrintCraft AI - Professional Print on Demand</title>
  <meta name="description" content="Create stunning designs with AI-powered print on demand solutions" />
</svelte:head>

<div class="app-layout" data-theme={currentTheme}>
  <!-- Sidebar -->
  <aside class="sidebar">
    <div class="sidebar-content">
      <!-- Profile Button at Bottom -->
      <div class="sidebar-bottom">
        <ProfileButton onClick={handleProfileClick} />
      </div>
    </div>
  </aside>
  
  <!-- Main Content Area -->
  <main class="main-content">
    <div class="content-area">
      <!-- Dynamic UI Components will be rendered here -->
      <div class="component-container">
        <slot />
      </div>
    </div>
  </main>
  
  <!-- Agent Chat UI -->
  <aside class="chat-panel">
    <div class="chat-content">
      <div class="chat-header">
        <h3>AI Design Assistant</h3>
        <p>Let's create something amazing together</p>
      </div>
      <div class="chat-placeholder">
        <p>Chat interface will be implemented next</p>
      </div>
    </div>
  </aside>
</div>

<!-- Auth Modal -->
{#if showAuthModal}
  <AuthModal on:close={closeAuthModal} />
{/if}

<style>
  .app-layout {
    display: flex;
    height: 100vh;
    background-color: var(--color-bg-primary);
  }
  
  /* Sidebar */
  .sidebar {
    width: var(--sidebar-width);
    background-color: var(--color-bg-secondary);
    border-right: 1px solid var(--color-border-primary);
    display: flex;
    flex-direction: column;
  }
  
  .sidebar-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: var(--spacing-4);
  }
  
  .sidebar-bottom {
    margin-top: auto;
  }
  
  /* Main Content */
  .main-content {
    width: var(--main-content-width);
    background-color: var(--color-bg-primary);
    border-right: 1px solid var(--color-border-primary);
    display: flex;
    flex-direction: column;
  }
  
  .content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .component-container {
    flex: 1;
    padding: var(--spacing-6);
    overflow-y: auto;
  }
  
  /* Chat Panel */
  .chat-panel {
    width: var(--chat-width);
    background-color: var(--color-bg-secondary);
    display: flex;
    flex-direction: column;
  }
  
  .chat-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: var(--spacing-6);
  }
  
  .chat-header {
    margin-bottom: var(--spacing-6);
    padding-bottom: var(--spacing-4);
    border-bottom: 1px solid var(--color-border-primary);
  }
  
  .chat-header h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-1);
  }
  
  .chat-header p {
    color: var(--color-text-secondary);
    font-size: 0.875rem;
  }
  
  .chat-placeholder {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-tertiary);
    font-style: italic;
  }
  
  /* Mobile Responsiveness */
  @media (max-width: 768px) {
    .app-layout {
      flex-direction: column;
    }
    
    .sidebar {
      width: 100%;
      height: auto;
      order: 3;
    }
    
    .sidebar-content {
      flex-direction: row;
      padding: var(--spacing-3);
    }
    
    .sidebar-bottom {
      margin-top: 0;
      margin-left: auto;
    }
    
    .main-content {
      width: 100%;
      order: 1;
    }
    
    .chat-panel {
      width: 100%;
      height: 300px;
      order: 2;
    }
  }
</style>