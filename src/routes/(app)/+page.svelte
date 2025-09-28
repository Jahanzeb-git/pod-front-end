<script lang="ts">
  import Cta from '$lib/components/Cta.svelte';
  import CatalogUI from '$lib/components/CatalogUI.svelte';

  let showCatalog = false;

  function handleShowCatalog() {
    showCatalog = true;
  }
</script>

<div class="page-container">
  {#if showCatalog}
    <CatalogUI />
  {:else}
    <Cta on:showCatalog={handleShowCatalog} />
  {/if}
</div>

<style>
  .page-container {
    width: 100%;
    height: 100%;
  }
</style>
