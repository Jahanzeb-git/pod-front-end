<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Category } from '$lib/types/catalog';

  export let categories: Category[];
  export let loading = false;

  const dispatch = createEventDispatcher<{ select: { category: Category } }>();

  const categoryDescriptions: Record<number, string> = {
    1: "Discover stylish apparel for men",
    2: "Explore fashionable women's clothing",
    3: "Fun and comfortable clothing for kids",
    5: "Beautiful items for your home"
  };
</script>

<div class="category-section">
  <div class="category-header">
    <h1 class="category-title">Product Catalog</h1>
    <p class="category-subtitle">Select a category to start exploring</p>
  </div>

  <div class="category-grid">
    {#if loading}
      {#each Array(4) as _}
        <div class="category-card skeleton">
          <div class="skeleton-img"></div>
          <div class="skeleton-content">
            <div class="skeleton-text skeleton-title"></div>
            <div class="skeleton-text skeleton-desc"></div>
          </div>
        </div>
      {/each}
    {:else}
      {#each categories as category (category.id)}
        <button
          class="category-card"
          on:click={() => dispatch('select', { category })}
        >
          <div class="card-image-wrapper">
            <img src={category.image_url} alt={category.title} class="card-image" />
            <div class="card-overlay"></div>
          </div>
          <div class="card-content">
            <h3 class="card-title">{category.title}</h3>
            <p class="card-description">{categoryDescriptions[category.id] || ''}</p>
          </div>
        </button>
      {/each}
    {/if}
  </div>
</div>

<style>
  .category-section {
    padding: var(--spacing-6) 0;
  }

  .category-header {
    text-align: center;
    margin-bottom: var(--spacing-12);
  }

  .category-title {
    font-size: 2.25rem;
    font-weight: 800;
    margin-bottom: var(--spacing-2);
    color: var(--color-text-primary);
  }

  .category-subtitle {
    font-size: 1.125rem;
    color: var(--color-text-secondary);
  }

  .category-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-6);
  }

  .category-card {
    position: relative;
    background: var(--color-bg-elevated);
    border: 1px solid var(--color-border-primary);
    border-radius: var(--radius-2xl);
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    padding: 0;
    width: 100%;
    text-align: left;
  }

  .category-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
    border-color: var(--color-primary-500);
  }

  .card-image-wrapper {
    position: relative;
    width: 100%;
    padding-top: 75%; /* 4:3 aspect ratio */
    overflow: hidden;
  }

  .card-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .category-card:hover .card-image {
    transform: scale(1.05);
  }

  .card-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent);
  }

  .card-content {
    padding: var(--spacing-5);
  }

  .card-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-2);
  }

  .card-description {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    line-height: 1.5;
  }

  /* Skeleton Loader */
  .skeleton {
    pointer-events: none;
  }

  .skeleton-img {
    width: 100%;
    padding-top: 75%;
    background: var(--color-bg-tertiary);
    animation: skeleton-loading 1.5s infinite;
  }

  .skeleton-content {
    padding: var(--spacing-5);
  }

  .skeleton-text {
    height: 16px;
    background: var(--color-bg-tertiary);
    border-radius: var(--radius-sm);
    animation: skeleton-loading 1.5s infinite;
  }

  .skeleton-title {
    width: 70%;
    height: 20px;
    margin-bottom: var(--spacing-3);
  }

  .skeleton-desc {
    width: 90%;
  }

  @keyframes skeleton-loading {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  /* Mobile: Stack in 2x2 grid */
  @media (max-width: 768px) {
    .category-header {
      margin-bottom: var(--spacing-8);
    }

    .category-title {
      font-size: 1.75rem;
    }

    .category-subtitle {
      font-size: 1rem;
    }

    .category-grid {
      gap: var(--spacing-4);
    }

    .card-content {
      padding: var(--spacing-4);
    }

    .card-title {
      font-size: 1.125rem;
    }

    .card-description {
      font-size: 0.8125rem;
    }
  }

  @media (max-width: 480px) {
    .category-grid {
      gap: var(--spacing-3);
    }

    .card-content {
      padding: var(--spacing-3);
    }
  }
</style>
