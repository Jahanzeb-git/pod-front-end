<script lang="ts">
  import { Palette } from 'lucide-svelte';
</script>

<footer class="page-footer">
  <div class="footer-container">
    <div class="footer-content">
      <div class="footer-brand">
        <Palette size={28} />
        <span>PrintCraft AI</span>
      </div>
      <div class="footer-links">
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
        <a href="/terms">Terms</a>
        <a href="/privacy">Privacy</a>
      </div>
      <div class="footer-copyright">
        © 2024 PrintCraft AI. All rights reserved.
      </div>
    </div>
  </div>
</footer>

<style>
  .page-footer {
    padding: 4rem 2rem;
    background-color: var(--color-secondary-900); /* Dark background for light theme */
    color: var(--color-secondary-200); /* Light text for light theme */
  }

  [data-theme="dark"] .page-footer {
    background-color: var(--color-bg-tertiary);
    border-top: 1px solid var(--color-border-primary);
    color: var(--color-text-secondary);
  }
  
  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 2rem;
  }
  
  .footer-brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 700;
    font-size: 1.125rem;
    color: var(--color-primary-400);
  }

  [data-theme="dark"] .footer-brand {
    color: var(--color-primary-600);
  }
  
  .footer-links {
    display: flex;
    gap: 2rem;
  }
  
  .footer-links a {
    color: var(--color-secondary-200);
    text-decoration: none;
    font-size: 0.95rem;
    transition: color 0.2s;
  }

  [data-theme="dark"] .footer-links a {
    color: var(--color-text-secondary);
  }
  
  .footer-links a:hover {
    color: white;
  }

  [data-theme="dark"] .footer-links a:hover {
    color: var(--color-primary-600);
  }
  
  .footer-copyright {
    color: var(--color-secondary-400);
    font-size: 0.875rem;
  }

  [data-theme="dark"] .footer-copyright {
    color: var(--color-text-tertiary);
  }

  @media (max-width: 768px) {
    .footer-content {
      flex-direction: column;
      text-align: center;
    }
    
    .footer-links {
      flex-wrap: wrap;
      justify-content: center;
    }
  }
</style>