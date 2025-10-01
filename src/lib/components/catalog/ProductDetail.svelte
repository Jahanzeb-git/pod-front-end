<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { catalogApi } from '$lib/api/catalogApi';
  import type { Product, UserSelection, Placement, CatalogVariant, ProductPricing } from '$lib/types/catalog';

  export let product: Product;

  const dispatch = createEventDispatcher<{ continue: { selection: UserSelection } }>();

  let selectedSize = '';
  let selectedColor = '';
  let selectedPlacement: Placement | null = null;
  let loading = false;
  let error = '';
  let pricing: ProductPricing | null = null;
  let calculatedPrice: { base: number; retail: number; technique: number; placement: number } | null = null;

  // Initialize default selections
  onMount(() => {
    if (product.sizes.length > 0) selectedSize = product.sizes[0];
    if (product.colors.length > 0) selectedColor = product.colors[0].name;
    if (product.placements.length > 0) selectedPlacement = product.placements[0];
    loadPricing();
  });

  async function loadPricing() {
    try {
      pricing = await catalogApi.getProductPricing(product.id);
      updatePrice();
    } catch (err) {
      console.error('Failed to load pricing:', err);
    }
  }

  function updatePrice() {
    if (!pricing || !selectedPlacement) {
      calculatedPrice = null;
      return;
    }

    const price = catalogApi.calculatePrice(
      pricing,
      selectedPlacement.technique,
      selectedPlacement.placement
    );
    calculatedPrice = price;
  }

  function handlePlacementChange(placement: Placement) {
    selectedPlacement = placement;
    updatePrice();
  }

  async function handleContinue() {
    if (!selectedSize || !selectedColor || !selectedPlacement || !calculatedPrice) {
      error = 'Please select all required options';
      return;
    }

    loading = true;
    error = '';

    try {
      // Get variant and placement dimensions
      const variants = await catalogApi.getProductVariants(
        product.id,
        selectedSize,
        selectedColor
      );

      if (variants.length === 0) {
        error = 'Selected variant not available';
        loading = false;
        return;
      }

      const variant = variants[0];
      const dimension = variant.placement_dimensions.find(
        d => d.placement === selectedPlacement!.placement
      );

      if (!dimension) {
        error = 'Placement dimensions not available';
        loading = false;
        return;
      }

      const selection: UserSelection = {
        color: selectedColor,
        size: selectedSize,
        placement: selectedPlacement,
        variant_id: variant.id,
        dimensions: dimension,
        pricing: {
          base_price: calculatedPrice.base,
          retail_price: calculatedPrice.retail,
          technique_price: calculatedPrice.technique,
          placement_price: calculatedPrice.placement
        }
      };

      // Submit to backend
      await catalogApi.submitProductSelection(product, selection);
      
      dispatch('continue', { selection });
    } catch (err: any) {
      error = err.message || 'Failed to process selection';
    } finally {
      loading = false;
    }
  }
</script>

<div class="product-detail">
  <!-- Product Image -->
  <div class="product-image-section">
    <img src={product.image} alt={product.name} class="product-image" />
  </div>

  <!-- Product Info -->
  <div class="product-info-section">
    <div class="product-header">
      <p class="product-brand">{product.brand}</p>
      <h1 class="product-name">{product.name}</h1>
      {#if calculatedPrice}
        <p class="product-price">${calculatedPrice.retail.toFixed(2)}</p>
      {/if}
    </div>

    <p class="product-description">{product.description}</p>

    <!-- Size Selection -->
    <div class="option-section">
      <label class="option-label">Size</label>
      <div class="option-grid">
        {#each product.sizes as size}
          <button
            class="option-button"
            class:active={selectedSize === size}
            on:click={() => selectedSize = size}
          >
            {size}
          </button>
        {/each}
      </div>
    </div>

    <!-- Color Selection -->
    <div class="option-section">
      <label class="option-label">
        Color <span class="option-selected">{selectedColor}</span>
      </label>
      <div class="color-grid">
        {#each product.colors as color}
          <button
            class="color-button"
            class:active={selectedColor === color.name}
            style="background-color: {color.value}"
            title={color.name}
            on:click={() => selectedColor = color.name}
          >
            {#if selectedColor === color.name}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13 4L6 11L3 8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            {/if}
          </button>
        {/each}
      </div>
    </div>

    <!-- Placement Selection -->
    <div class="option-section">
      <label class="option-label">Print Placement</label>
      <div class="placement-grid">
        {#each product.placements as placement}
          <button
            class="placement-button"
            class:active={selectedPlacement?.placement === placement.placement}
            on:click={() => handlePlacementChange(placement)}
          >
            <span class="placement-name">{placement.placement.replace(/_/g, ' ')}</span>
            <span class="placement-technique">{placement.technique.toUpperCase()}</span>
          </button>
        {/each}
      </div>
    </div>

    <!-- Error Message -->
    {#if error}
      <div class="error-message">{error}</div>
    {/if}

    <!-- Continue Button -->
    <button
      class="btn btn-primary btn-large"
      on:click={handleContinue}
      disabled={loading || !selectedSize || !selectedColor || !selectedPlacement}
    >
      {#if loading}
        <div class="loading-spinner"></div>
        Processing...
      {:else}
        Continue with AI Design →
      {/if}
    </button>
  </div>
</div>

<style>
  .product-detail {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-10);
    max-width: 1200px;
    margin: 0 auto;
  }

  .product-image-section {
    position: sticky;
    top: var(--spacing-6);
    height: fit-content;
  }

  .product-image {
    width: 100%;
    border-radius: var(--radius-2xl);
    border: 1px solid var(--color-border-primary);
    background: var(--color-bg-tertiary);
  }

  .product-info-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-6);
  }

  .product-header {
    padding-bottom: var(--spacing-4);
    border-bottom: 1px solid var(--color-border-primary);
  }

  .product-brand {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-primary-600);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: var(--spacing-2);
  }

  .product-name {
    font-size: 1.875rem;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-3);
    line-height: 1.3;
  }

  .product-price {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-primary-600);
  }

  .product-description {
    font-size: 0.9375rem;
    color: var(--color-text-secondary);
    line-height: 1.6;
  }

  .option-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
  }

  .option-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text-primary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .option-selected {
    font-weight: 400;
    text-transform: none;
    color: var(--color-text-tertiary);
    margin-left: var(--spacing-2);
  }

  .option-grid {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-2);
  }

  .option-button {
    padding: var(--spacing-3) var(--spacing-5);
    background: var(--color-bg-elevated);
    border: 1.5px solid var(--color-border-primary);
    border-radius: var(--radius-lg);
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .option-button:hover {
    border-color: var(--color-primary-500);
    color: var(--color-text-primary);
  }

  .option-button.active {
    background: var(--color-primary-600);
    border-color: var(--color-primary-600);
    color: white;
  }

  .color-grid {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-3);
  }

  .color-button {
    width: 48px;
    height: 48px;
    border: 2px solid var(--color-border-primary);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  .color-button:hover {
    transform: scale(1.1);
    border-color: var(--color-primary-500);
  }

  .color-button.active {
    border-color: var(--color-primary-600);
    border-width: 3px;
    box-shadow: 0 0 0 2px var(--color-bg-primary), 0 0 0 4px var(--color-primary-600);
  }

  .placement-grid {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2);
  }

  .placement-button {
    padding: var(--spacing-4);
    background: var(--color-bg-elevated);
    border: 1.5px solid var(--color-border-primary);
    border-radius: var(--radius-lg);
    text-align: left;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .placement-button:hover {
    border-color: var(--color-primary-500);
    background: var(--color-bg-primary);
  }

  .placement-button.active {
    background: var(--color-primary-50);
    border-color: var(--color-primary-600);
  }

  [data-theme="dark"] .placement-button.active {
    background: var(--color-primary-900);
  }

  .placement-name {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--color-text-primary);
    text-transform: capitalize;
  }

  .placement-technique {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-text-tertiary);
    padding: 4px 8px;
    background: var(--color-bg-secondary);
    border-radius: var(--radius-sm);
  }

  .btn-large {
    width: 100%;
    padding: var(--spacing-4) var(--spacing-6);
    font-size: 1rem;
    margin-top: var(--spacing-4);
  }

  /* Mobile */
  @media (max-width: 768px) {
    .product-detail {
      grid-template-columns: 1fr;
      gap: var(--spacing-6);
    }

    .product-image-section {
      position: relative;
      top: 0;
    }

    .product-name {
      font-size: 1.5rem;
    }

    .product-price {
      font-size: 1.25rem;
    }

    .color-button {
      width: 40px;
      height: 40px;
    }
  }
</style>
