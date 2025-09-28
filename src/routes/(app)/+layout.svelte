<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { themeStore } from '$lib/stores/theme';
  import { isAuthenticated } from '$lib/stores/auth';
  import ProfileButton from '$lib/components/ProfileButton.svelte';
  
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
      goto('/auth');
    } else {
      // TODO: Show profile menu when implemented
      console.log('Profile menu will be implemented later');
    }
  }
</script>

<svelte:head>
  <title>PrintCraft AI - Professional Print on Demand</title>
  <meta name="description" content="Create stunning designs with AI-powered print on demand solutions" />
</svelte:head>

<!-- Main Application Layout -->
<div class="app-layout" data-theme={currentTheme}>
  <!-- Sidebar -->
  <aside class="sidebar">
    <div class="sidebar-content">
      <!-- Logo/Brand Area -->
      <div class="sidebar-brand">
        <div class="brand-logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="url(#gradient)"/>
            <path d="M8 12h16v8H8z" fill="white" opacity="0.9"/>
            <circle cx="16" cy="16" r="3" fill="url(#gradient)"/>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:var(--color-primary-500)"/>
                <stop offset="100%" style="stop-color:var(--color-primary-600)"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      
      <!-- Navigation Area - Future implementation -->
      <div class="sidebar-nav">
        <!-- Navigation items will go here -->
      </div>
      
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
    align-items: center;
  }
  
  .sidebar-brand {
    margin-bottom: var(--spacing-6);
  }
  
  .brand-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.2s ease;
  }
  
  .brand-logo:hover {
    transform: scale(1.05);
  }
  
  .sidebar-nav {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-3);
  }
  
  .sidebar-bottom {
    width: 100%;
    display: flex;
    justify-content: center;
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
    padding: var(--spacing-4);
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
      height: 60px;
      order: 3;
    }
    
    .sidebar-content {
      flex-direction: row;
      padding: var(--spacing-3) var(--spacing-4);
      justify-content: space-between;
    }
    
    .sidebar-brand {
      margin-bottom: 0;
    }
    
    .sidebar-nav {
      flex-direction: row;
      flex: 1;
      justify-content: center;
      margin: 0 var(--spacing-4);
    }
    
    .sidebar-bottom {
      margin-left: 0;
      width: auto;
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
  
  /* Tablet and small desktop adjustments */
  @media (max-width: 1024px) and (min-width: 769px) {
    :root {
      --sidebar-width: 70px;
      --chat-width: 360px;
      --main-content-width: calc(100vw - 70px - 360px);
    }
    
    .sidebar-content {
      padding: var(--spacing-3);
    }
  }
</style>