<script lang="ts">
  import { onMount } from 'svelte';
  import { themeStore } from '$lib/stores/theme';
  import { sdkReady } from '$lib/stores/sdk';

  let currentTheme: 'light' | 'dark';

  themeStore.subscribe(theme => {
    currentTheme = theme;
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  });

  onMount(() => {
    const themeCleanup = themeStore.init();

    // --- SDK Initialization ---
    // Facebook
    (window as any).fbAsyncInit = function() {
      window.FB.init({
        appId      : 'YOUR_FACEBOOK_APP_ID', // IMPORTANT: Replace with your actual App ID
        cookie     : true,
        xfbml      : true,
        version    : 'v19.0'
      });
      sdkReady.update(s => ({ ...s, facebook: true }));
    };

    // Google
    // The Google script loads and initializes itself. We can check for its readiness.
    const googleCheck = setInterval(() => {
      if (window.google) {
        sdkReady.update(s => ({ ...s, google: true }));
        clearInterval(googleCheck);
      }
    }, 100);

    return () => {
      themeCleanup();
      clearInterval(googleCheck);
    };
  });
</script>

<svelte:head>
  <!-- Google OAuth -->
  <script src="https://accounts.google.com/gsi/client" async defer></script>
  <!-- Facebook SDK -->
  <script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js"></script>
</svelte:head>

<div class="auth-layout" data-theme={currentTheme}>
  <div class="main-content">
    <slot />
  </div>
</div>

<style>
  .auth-layout {
    min-height: 100vh;
    background: linear-gradient(180deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%);
  }

  .main-content {
    position: relative;
    z-index: 2;
  }
</style>
