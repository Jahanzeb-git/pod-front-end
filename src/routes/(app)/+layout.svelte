<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { themeStore } from '$lib/stores/theme';
  import { isAuthenticated } from '$lib/stores/auth';
  import ProfileButton from '$lib/components/ProfileButton.svelte';
  import AgentInput from '$lib/components/agent/AgentInput.svelte';

  let currentTheme: 'light' | 'dark' = 'light';
  
  themeStore.subscribe(theme => {
    currentTheme = theme;
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  });
  
  onMount(() => {
    const cleanup = themeStore.init();
    return cleanup;
  });
  
  function handleProfileClick() {
    if (!$isAuthenticated) {
      goto('/auth');
    } else {
      console.log('Profile menu will be implemented later');
    }
  }

  function handleSend(value: string) {
    console.log('Sending:', value);
    // AI agent logic will go here
  }

  function handleMenu() {
    console.log('Menu clicked, navigation sheet will be implemented later');
  }
</script>

<svelte:head>
  <title>PrintCraft AI - Professional Print on Demand</title>
  <meta name="description" content="Create stunning designs with AI-powered print on demand solutions" />
</svelte:head>

<div class="app-layout" data-theme={currentTheme}>
  <!-- Sidebar (Desktop) -->
  <aside class="sidebar">
    <div class="sidebar-content">
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
      <div class="sidebar-nav">
        <!-- Desktop navigation items -->
      </div>
      <div class="sidebar-bottom">
        <ProfileButton onClick={handleProfileClick} />
      </div>
    </div>
  </aside>
  
  <!-- Main Content Area (Now contains the slot for all views) -->
  <main class="main-content">
    <slot />
  </main>
  
  <!-- Agent Chat UI (Desktop) -->
  <aside class="chat-panel">
    <div class="chat-header">
      <h3>AI Design Assistant</h3>
    </div>
    <div class="chat-messages-area">
      <!-- Chat messages will be rendered here -->
    </div>
    <div class="chat-input-area">
      <AgentInput on:send={(e) => handleSend(e.detail.value)} on:menu={handleMenu} />
    </div>
  </aside>
</div>

<style>
  .app-layout {
    display: flex;
    height: 100vh;
    background-color: var(--color-bg-primary);
    overflow: hidden; /* Prevent body scroll */
  }
  
  /* --- Desktop Layout (Grid-based) --- */
  @media (min-width: 769px) {
    .app-layout {
      display: grid;
      grid-template-columns: var(--sidebar-width) 1fr var(--chat-width);
    }
  }

  /* Sidebar (Desktop) */
  .sidebar {
    background-color: var(--color-bg-secondary);
    border-right: 1px solid var(--color-border-primary);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
  }
  
  .sidebar-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: var(--spacing-4);
    align-items: center;
  }
  
  .sidebar-brand { margin-bottom: var(--spacing-6); }
  .sidebar-nav { flex: 1; }
  .sidebar-bottom { margin-top: auto; }

  /* Main Content (All Screens) */
  .main-content {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
  
  /* Agent Chat UI (Desktop) */
  .chat-panel {
    background-color: var(--color-bg-secondary);
    border-left: 1px solid var(--color-border-primary);
    display: flex;
    flex-direction: column;
    height: 100vh; /* Full height */
  }
  
  .chat-header {
    padding: var(--spacing-4);
    border-bottom: 1px solid var(--color-border-primary);
    flex-shrink: 0;
  }
  
  .chat-header h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-text-primary);
  }
  
  .chat-messages-area {
    flex: 1;
    overflow-y: auto;
    position: relative;
  }

  .chat-input-area {
    flex-shrink: 0;
  }

  /* --- Mobile First Refactor --- */
  @media (max-width: 768px) {
    .sidebar, .chat-panel {
      display: none; /* Hide sidebar and desktop chat panel on mobile */
    }

    .main-content {
      width: 100%;
      /* On mobile, the main content IS the chat view */
      /* It will contain the slot and the agent input */
      display: flex; /* Use flex to position input at bottom */
      flex-direction: column;
      height: 100vh;
    }

    /* We need a new structure for mobile inside main-content */
    :global(.mobile-chat-wrapper) {
      flex: 1;
      overflow-y: auto;
    }
    :global(.mobile-input-wrapper) {
      flex-shrink: 0;
    }
  }
</style>