<script lang="ts">
  import AppCard from '$lib/components/shared/AppCard.svelte';
</script>

<AppCard>
  <h1 class="catalog-title">Product Catalog</h1>
  <p class="catalog-subtitle">Select a category to start exploring.</p>
  
  <!-- Category Grid will be implemented here -->
</AppCard>

<style>
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