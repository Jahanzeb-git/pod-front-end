<script lang="ts">
  import Cta from '$lib/components/Cta.svelte';
  import CatalogUI from '$lib/components/CatalogUI.svelte';
  import AgentInput from '$lib/components/agent/AgentInput.svelte';

  let showCatalog = false;

  function handleShowCatalog() {
    showCatalog = true;
  }

  function handleSend(value: string) {
    console.log('Sending:', value);
  }

  function handleMenu() {
    console.log('Menu clicked');
  }
</script>

<div class="page-wrapper">
  <div class="content-wrapper">
    {#if showCatalog}
      <CatalogUI />
    {:else}
      <Cta on:showCatalog={handleShowCatalog} />
    {/if}
  </div>
  <div class="mobile-input-wrapper">
    <AgentInput on:send={(e) => handleSend(e.detail.value)} on:menu={handleMenu} />
  </div>
</div>

<style>
  .page-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .content-wrapper {
    flex: 1;
    overflow-y: auto;
  }
  .mobile-input-wrapper {
    display: none; /* Hidden by default */
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    .mobile-input-wrapper {
      display: block; /* Show only on mobile */
    }
  }
</style>
