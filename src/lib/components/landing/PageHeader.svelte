<script lang="ts">
  import { Palette } from 'lucide-svelte';
  import { onMount } from 'svelte';

  let scrolled = false;

  function handleScroll() {
    scrolled = window.scrollY > 10;
  }

  onMount(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  });
</script>

<svelte:window on:scroll={handleScroll} />

<nav class="auth-nav" class:scrolled>
  <div class="nav-container">
    <div class="nav-logo">
      <Palette size={32} />
      <span>PrintCraft AI</span>
    </div>
    <div class="nav-actions">
      <div class="nav-links">
        <a href="#how-it-works">How it works</a>
        <a href="#categories">Categories</a>
        <a href="#faq">FAQ</a>
      </div>
      <button class="btn btn-cta">Contact Us</button>
    </div>
  </div>
</nav>

<style>
  .auth-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: transparent;
    border-bottom: 1px solid transparent;
    transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  }
  
  .auth-nav.scrolled {
    background: var(--color-bg-glass);
    backdrop-filter: blur(10px);
    border-bottom-color: var(--color-border-primary);
    box-shadow: var(--shadow-sm);
  }
  
  .nav-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .nav-logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 700;
    font-size: 1.25rem;
    color: var(--color-primary-600);
  }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: 2rem;
  }
  
  .nav-links {
    display: flex;
    gap: 2rem;
  }
  
  .nav-links a {
    color: var(--color-text-secondary);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
    font-size: 0.95rem;
  }
  
  .nav-links a:hover {
    color: var(--color-primary-600);
  }

  /* Base button styles (from app.css for consistency) */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1.25rem;
    border-radius: var(--radius-xl);
    font-weight: 600;
    font-size: 0.875rem;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-cta {
    background-color: var(--color-text-primary);
    color: var(--color-bg-primary);
  }

  .btn-cta:hover {
    opacity: 0.85;
  }

  [data-theme="dark"] .btn-cta {
    background-color: var(--color-text-primary);
    color: var(--color-bg-primary);
  }

  @media (max-width: 768px) {
    .nav-actions {
      display: none;
    }

    /* Disable expensive blur on mobile for performance */
    .auth-nav.scrolled {
      backdrop-filter: none;
      background: var(--color-bg-secondary);
    }
  }
</style>