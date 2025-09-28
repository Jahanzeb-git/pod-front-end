<script lang="ts">
  // This component will house the product catalog.
  // It is designed to fit within the main content area, between the sidebar and chat panel.
</script>

<div class="catalog-wrapper">
  <div class="catalog-container">
    <h1 class="catalog-title">Product Catalog</h1>
    <p class="catalog-subtitle">Select a category to start exploring.</p>
    
    <!-- Category Grid will be implemented here -->

  </div>
</div>

<style>
  .catalog-wrapper {
    padding: var(--spacing-2);
    height: 100%;
  }

  .catalog-container {
    width: 100%;
    height: 100%;
    padding: var(--spacing-4);
    background-color: var(--color-bg-secondary);
    border-radius: var(--radius-3xl);
    border: 1px solid var(--color-border-primary);
  }

  .catalog-title {
    font-size: 2.25rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
    color: var(--color-text-primary);
  }

  .catalog-subtitle {
    font-size: 1.125rem;
    color: var(--color-text-secondary);
    margin-bottom: 3rem;
  }
</style>