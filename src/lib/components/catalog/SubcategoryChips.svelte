<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Category } from '$lib/types/catalog';

  export let subcategories: Category[];
  export let selectedId: number | null = null;
  export let loading = false;

  const dispatch = createEventDispatcher<{ select: { subcategory: Category } }>();
</script>

<div class="chips-container">
  <div class="chips-scroll">
    {#if loading}
      {#each Array(5) as _}
        <div class="chip skeleton-chip"></div>
      {/each}
    {:else}
      {#each subcategories as subcategory (subcategory.id)}
        <button
          class="chip"
          class:active={selectedId === subcategory.id}
          on:click={() => dispatch('select', { subcategory })}
        >
          {subcategory.title}
        </button>
      {/each}
    {/if}
  </div>
</div>

<style>
  .chips-container {
    width: 100%;
    margin-bottom: var(--spacing-6);
    position: relative;
  }

  .chips-scroll {
    display: flex;
    gap: var(--spacing-3);
    overflow-x: auto;
    padding: var(--spacing-2) 0;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .chips-scroll::-webkit-scrollbar {
    display: none;
  }

  .chip {
    flex-shrink: 0;
    padding: var(--spacing-2) var(--spacing-5);
    background-color: var(--color-bg-elevated);
    border: 1px solid var(--color-border-primary);
    border-radius: var(--radius-full);
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .chip:hover {
    background-color: var(--color-interactive-secondary-hover);
    border-color: var(--color-border-secondary);
    color: var(--color-text-primary);
  }

  .chip.active {
    background-color: var(--color-primary-600);
    border-color: var(--color-primary-600);
    color: white;
  }

  .chip.active:hover {
    background-color: var(--color-primary-700);
    border-color: var(--color-primary-700);
  }

  .skeleton-chip {
    width: 100px;
    height: 36px;
    background: var(--color-bg-tertiary);
    animation: skeleton-loading 1.5s infinite;
    pointer-events: none;
  }

  @keyframes skeleton-loading {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @media (max-width: 768px) {
    .chips-container {
      margin-bottom: var(--spacing-4);
    }

    .chip {
      padding: var(--spacing-2) var(--spacing-4);
      font-size: 0.8125rem;
    }
  }
</style>
