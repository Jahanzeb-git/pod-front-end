<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Category, Product } from '$lib/types/catalog';

  export let items: (Category | Product)[] = [];
  export let type: 'category' | 'product' = 'product';
  export let loading = false;

  const dispatch = createEventDispatcher<{
    selectCategory: { category: Category };
    selectProduct: { product: Product };
  }>();

  function isProduct(item: Category | Product): item is Product {
    return 'brand' in item;
  }

  function handleClick(item: Category | Product) {
    if (isProduct(item)) {
      dispatch('selectProduct', { product: item });
    } else {
      dispatch('selectCategory', { category: item });
    }
  }
</script>

<div class="pins-grid">
  {#if loading}
    {#each Array(8) as _}
      <div class="pin skeleton-pin">
        <div class="skeleton-image"></div>
        <div class="pin-content">
          <div class="skeleton-text skeleton-title"></div>
          <div class="skeleton-text skeleton-subtitle"></div>
        </div>
      </div>
    {/each}
  {:else if items.length === 0}
    <div class="empty-state">
      <p>No items found in this category</p>
    </div>
  {:else}
    {#each items as item (item.id)}
      <button class="pin" on:click={() => handleClick(item)}>
        <div class="pin-image-wrapper">
          <img
            src={isProduct(item) ? item.image : item.image_url}
            alt={isProduct(item) ? item.name : item.title}
            class="pin-image"
            loading="lazy"
          />
        </div>
        <div class="pin-content">
          <h3 class="pin-title">
            {isProduct(item) ? item.name : item.title}
          </h3>
          {#if isProduct(item)}
            <p class="pin-brand">{item.brand}</p>
            <div class="pin-meta">
              <div class="pin-colors">
                {#each item.colors.slice(0, 5) as color}
                  <div
                    class="color-dot"
                    style="background-color: {color.value}"
                    title={color.name}
                  ></div>
                {/each}
                {#if item.colors.length > 5}
                  <span class="color-more">+{item.colors.length - 5}</span>
                {/if}
              </div>
              <div class="pin-sizes">
                {#each item.sizes.slice(0, 3) as size}
                  <span class="size-badge">{size}</span>
                {/each}
                {#if item.sizes.length > 3}
                  <span class="size-more">+{item.sizes.length - 3}</span>
                {/if}
              </div>
            </div>
          {/if}
        </div>
      </button>
    {/each}
  {/if}
</div>

<style>
  .pins-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: var(--spacing-4);
    width: 100%;
  }

  .pin {
    background: var(--color-bg-elevated);
    border: 1px solid var(--color-border-primary);
    border-radius: var(--radius-2xl);
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 0;
    width: 100%;
    text-align: left;
    display: flex;
    flex-direction: column;
  }

  .pin:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    border-color: var(--color-primary-500);
  }

  .pin-image-wrapper {
    position: relative;
    width: 100%;
    padding-top: 100%; /* Square aspect ratio */
    overflow: hidden;
    background: var(--color-bg-tertiary);
  }

  .pin-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .pin:hover .pin-image {
    transform: scale(1.05);
  }

  .pin-content {
    padding: var(--spacing-4);
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2);
  }

  .pin-title {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--color-text-primary);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .pin-brand {
    font-size: 0.8125rem;
    color: var(--color-text-tertiary);
    font-weight: 500;
  }

  .pin-meta {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2);
    margin-top: auto;
  }

  .pin-colors {
    display: flex;
    align-items: center;
    gap: var(--spacing-1);
    flex-wrap: wrap;
  }

  .color-dot {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 1.5px solid var(--color-border-primary);
    flex-shrink: 0;
  }

  .color-more {
    font-size: 0.75rem;
    color: var(--color-text-tertiary);
    font-weight: 500;
  }

  .pin-sizes {
    display: flex;
    align-items: center;
    gap: var(--spacing-1);
    flex-wrap: wrap;
  }

  .size-badge {
    padding: 2px var(--spacing-2);
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border-primary);
    border-radius: var(--radius-sm);
    font-size: 0.6875rem;
    font-weight: 600;
    color: var(--color-text-secondary);
  }

  .size-more {
    font-size: 0.75rem;
    color: var(--color-text-tertiary);
    font-weight: 500;
  }

  /* Skeleton */
  .skeleton-pin {
    pointer-events: none;
  }

  .skeleton-image {
    width: 100%;
    padding-top: 100%;
    background: var(--color-bg-tertiary);
    animation: skeleton-loading 1.5s infinite;
  }

  .skeleton-text {
    height: 14px;
    background: var(--color-bg-tertiary);
    border-radius: var(--radius-sm);
    animation: skeleton-loading 1.5s infinite;
  }

  .skeleton-title {
    width: 85%;
    height: 16px;
  }

  .skeleton-subtitle {
    width: 60%;
    margin-top: var(--spacing-1);
  }

  @keyframes skeleton-loading {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: var(--spacing-16) var(--spacing-4);
    color: var(--color-text-tertiary);
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .pins-grid {
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: var(--spacing-3);
    }

    .pin-content {
      padding: var(--spacing-3);
    }

    .pin-title {
      font-size: 0.875rem;
    }

    .pin-brand {
      font-size: 0.75rem;
    }

    .color-dot {
      width: 16px;
      height: 16px;
    }

    .size-badge {
      font-size: 0.625rem;
    }
  }

  @media (max-width: 480px) {
    .pins-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-2);
    }
  }
</style>
