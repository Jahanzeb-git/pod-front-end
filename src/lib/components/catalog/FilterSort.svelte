<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { SlidersHorizontal, ArrowUpDown } from 'lucide-svelte';
  import type { FilterOptions } from '$lib/types/catalog';

  export let options: FilterOptions = {
    sortBy: 'name',
    sortOrder: 'asc'
  };

  const dispatch = createEventDispatcher<{ change: { options: FilterOptions } }>();

  let showSortMenu = false;

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'price', label: 'Price' },
    { value: 'popular', label: 'Popular' }
  ];

  function handleSortChange(sortBy: 'name' | 'price' | 'popular') {
    options.sortBy = sortBy;
    dispatch('change', { options });
    showSortMenu = false;
  }

  function toggleSortOrder() {
    options.sortOrder = options.sortOrder === 'asc' ? 'desc' : 'asc';
    dispatch('change', { options });
  }
</script>

<div class="filter-sort-bar">
  <div class="filter-sort-controls">
    <!-- Sort Dropdown -->
    <div class="sort-control">
      <button
        class="control-button"
        on:click={() => showSortMenu = !showSortMenu}
      >
        <SlidersHorizontal size={18} />
        <span>Sort: {sortOptions.find(o => o.value === options.sortBy)?.label}</span>
      </button>
      
      {#if showSortMenu}
        <div class="sort-menu">
          {#each sortOptions as option}
            <button
              class="sort-option"
              class:active={options.sortBy === option.value}
              on:click={() => handleSortChange(option.value)}
            >
              {option.label}
            </button>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Order Toggle -->
    <button class="control-button" on:click={toggleSortOrder}>
      <ArrowUpDown size={18} />
      <span>{options.sortOrder === 'asc' ? 'A-Z' : 'Z-A'}</span>
    </button>
  </div>
</div>

<style>
  .filter-sort-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-4) 0;
    margin-bottom: var(--spacing-4);
  }

  .filter-sort-controls {
    display: flex;
    gap: var(--spacing-3);
  }

  .control-button {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    padding: var(--spacing-2) var(--spacing-4);
    background: var(--color-bg-elevated);
    border: 1px solid var(--color-border-primary);
    border-radius: var(--radius-lg);
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .control-button:hover {
    border-color: var(--color-border-secondary);
    color: var(--color-text-primary);
    background: var(--color-bg-primary);
  }

  .sort-control {
    position: relative;
  }

  .sort-menu {
    position: absolute;
    top: calc(100% + var(--spacing-2));
    left: 0;
    background: var(--color-bg-elevated);
    border: 1px solid var(--color-border-primary);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    z-index: 10;
    min-width: 150px;
    overflow: hidden;
  }

  .sort-option {
    width: 100%;
    padding: var(--spacing-3) var(--spacing-4);
    text-align: left;
    background: none;
    border: none;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .sort-option:hover {
    background: var(--color-bg-secondary);
    color: var(--color-text-primary);
  }

  .sort-option.active {
    background: var(--color-primary-50);
    color: var(--color-primary-600);
    font-weight: 600;
  }

  [data-theme="dark"] .sort-option.active {
    background: var(--color-primary-900);
  }

  @media (max-width: 768px) {
    .filter-sort-bar {
      padding: var(--spacing-3) 0;
      margin-bottom: var(--spacing-3);
    }

    .control-button {
      padding: var(--spacing-2) var(--spacing-3);
      font-size: 0.8125rem;
    }
  }
</style>
