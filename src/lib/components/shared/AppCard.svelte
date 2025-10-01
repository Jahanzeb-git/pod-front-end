<div class="app-card-wrapper">
  <div class="app-card-container">
    <slot />
  </div>
</div>

<style>
  .app-card-wrapper {
    height: 100%;
    width: 100%;
  }

  .app-card-container {
    width: 100%;
    height: 100%;
    padding: var(--spacing-4); /* Inner padding - ALWAYS ON */
    background-color: var(--color-bg-secondary);
    overflow-y: auto;
  }

  /* Desktop-only styles for the "card" look */
  @media (min-width: 769px) {
    .app-card-wrapper {
      padding: var(--spacing-1); /* Outer padding */
    }
    .app-card-container {
      border-radius: var(--radius-3xl);
      border: 1px solid var(--color-border-primary);
    }
  }
</style>