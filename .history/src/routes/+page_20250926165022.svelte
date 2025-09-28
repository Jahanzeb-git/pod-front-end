<script lang="ts">
  import CatalogUI from '$lib/components/CatalogUI.svelte';
  import AuthPage from '$lib/components/AuthPage.svelte';
</script>

<div class="page-container">
  <CatalogUI />
  <AuthPage />
</div>

<style>
  .page-container {
    width: 100%;
    height: 100%;
  }
</style>
