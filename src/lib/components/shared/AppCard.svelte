<div class="app-card-wrapper">
  <div class="app-card-container">
    <slot />
  </div>
</div>

<style>
  .app-card-wrapper {
    padding: var(--spacing-1);
    height: 100%;
  }

  .app-card-container {
    width: 100%;
    height: 100%;
    padding: var(--spacing-4);
    background-color: var(--color-bg-secondary);
    border-radius: var(--radius-3xl);
    border: 1px solid var(--color-border-primary);
    overflow-y: auto; /* Add scroll for content that overflows */
  }
</style>