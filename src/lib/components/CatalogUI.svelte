<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import AppCard from '$lib/components/shared/AppCard.svelte';
  import CategoryCards from '$lib/components/catalog/CategoryCards.svelte';
  import SubcategoryChips from '$lib/components/catalog/SubcategoryChips.svelte';
  import PinsGrid from '$lib/components/catalog/PinsGrid.svelte';
  import ProductDetail from '$lib/components/catalog/ProductDetail.svelte';
  import FilterSort from '$lib/components/catalog/FilterSort.svelte';
  import { catalogApi } from '$lib/api/catalogApi';
  import type { Category, Product, BreadcrumbItem, FilterOptions, UserSelection } from '$lib/types/catalog';
  import { ChevronRight, Home } from 'lucide-svelte';

  // State management
  let view: 'main' | 'subcategory' | 'pins' | 'product' = 'main';
  let loading = false;
  let error = '';

  // Data
  let mainCategories: Category[] = [];
  let currentCategory: Category | null = null;
  let subcategories: Category[] = [];
  let selectedSubcategory: Category | null = null;
  let pinsItems: (Category | Product)[] = [];
  let selectedProduct: Product | null = null;

  // UI State
  let breadcrumbs: BreadcrumbItem[] = [];
  let filterOptions: FilterOptions = { sortBy: 'name', sortOrder: 'asc' };

  onMount(() => {
    loadFromUrl();
    loadMainCategories();
  });

  // Load state from URL query params
  function loadFromUrl() {
    const params = new URLSearchParams($page.url.search);
    const categoryId = params.get('category');
    const subcategoryId = params.get('subcategory');
    const productId = params.get('product');

    if (productId) {
      view = 'product';
      loadProductFromUrl(parseInt(productId));
    } else if (subcategoryId) {
      view = 'pins';
      loadSubcategoryFromUrl(parseInt(categoryId!), parseInt(subcategoryId));
    } else if (categoryId) {
      view = 'subcategory';
      loadCategoryFromUrl(parseInt(categoryId));
    } else {
      view = 'main';
    }
  }

  async function loadMainCategories() {
    try {
      loading = true;
      mainCategories = await catalogApi.getMainCategories();
    } catch (err: any) {
      error = 'Failed to load categories';
      console.error(err);
    } finally {
      loading = false;
    }
  }

  async function loadCategoryFromUrl(categoryId: number) {
    try {
      loading = true;
      const allCategories = await catalogApi.getAllCategories();
      currentCategory = allCategories.find(c => c.id === categoryId) || null;
      if (currentCategory) {
        await handleCategorySelect(currentCategory);
      }
    } catch (err) {
      console.error(err);
    } finally {
      loading = false;
    }
  }

  async function loadSubcategoryFromUrl(categoryId: number, subcategoryId: number) {
    try {
      loading = true;
      const allCategories = await catalogApi.getAllCategories();
      currentCategory = allCategories.find(c => c.id === categoryId) || null;
      selectedSubcategory = allCategories.find(c => c.id === subcategoryId) || null;
      
      if (currentCategory && selectedSubcategory) {
        subcategories = await catalogApi.getSubcategories(categoryId);
        await handleSubcategorySelect(selectedSubcategory);
      }
    } catch (err) {
      console.error(err);
    } finally {
      loading = false;
    }
  }

  async function loadProductFromUrl(productId: number) {
    try {
      loading = true;
      selectedProduct = await catalogApi.getProduct(productId);
    } catch (err) {
      console.error(err);
    } finally {
      loading = false;
    }
  }

  function updateUrl() {
    const params = new URLSearchParams();
    
    if (currentCategory) {
      params.set('category', currentCategory.id.toString());
    }
    if (selectedSubcategory) {
      params.set('subcategory', selectedSubcategory.id.toString());
    }
    if (selectedProduct) {
      params.set('product', selectedProduct.id.toString());
    }

    const url = params.toString() ? `?${params.toString()}` : '';
    goto(url, { replaceState: true, noScroll: true });
  }

  async function handleCategorySelect(category: Category) {
    loading = true;
    currentCategory = category;
    view = 'subcategory';
    
    breadcrumbs = [
      { id: 0, title: 'Home', type: 'main' },
      { id: category.id, title: category.title, type: 'main' }
    ];

    try {
      subcategories = await catalogApi.getSubcategories(category.id);
      
      if (subcategories.length > 0) {
        selectedSubcategory = subcategories[0];
        await handleSubcategorySelect(subcategories[0]);
      } else {
        // No subcategories, load products directly
        pinsItems = await catalogApi.getProductsByCategory(category.id);
        view = 'pins';
      }
      
      updateUrl();
    } catch (err: any) {
      error = 'Failed to load subcategories';
      console.error(err);
    } finally {
      loading = false;
    }
  }

  async function handleSubcategorySelect(subcategory: Category) {
    loading = true;
    selectedSubcategory = subcategory;
    view = 'pins';

    breadcrumbs = [
      { id: 0, title: 'Home', type: 'main' },
      { id: currentCategory!.id, title: currentCategory!.title, type: 'main' },
      { id: subcategory.id, title: subcategory.title, type: 'subcategory' }
    ];

    try {
      const hasChildren = await catalogApi.hasChildren(subcategory.id);
      
      if (hasChildren) {
        // Load sub-subcategories as pins
        pinsItems = await catalogApi.getSubcategories(subcategory.id);
      } else {
        // Load products as pins
        pinsItems = await catalogApi.getProductsByCategory(subcategory.id);
      }
      
      updateUrl();
      applySorting();
    } catch (err: any) {
      error = 'Failed to load items';
      console.error(err);
    } finally {
      loading = false;
    }
  }

  async function handlePinCategorySelect(category: Category) {
    await handleSubcategorySelect(category);
  }

  async function handleProductSelect(product: Product) {
    loading = true;
    selectedProduct = product;
    view = 'product';

    breadcrumbs = [
      ...breadcrumbs,
      { id: product.id, title: product.name, type: 'product' }
    ];

    updateUrl();
    loading = false;
  }

  function handleBreadcrumbClick(item: BreadcrumbItem) {
    if (item.id === 0) {
      // Go to home
      view = 'main';
      currentCategory = null;
      selectedSubcategory = null;
      selectedProduct = null;
      breadcrumbs = [];
      goto('', { replaceState: true });
    } else if (item.type === 'main') {
      // Go to category
      const category = mainCategories.find(c => c.id === item.id);
      if (category) handleCategorySelect(category);
    } else if (item.type === 'subcategory') {
      // Go to subcategory
      catalogApi.getAllCategories().then(cats => {
        const subcategory = cats.find(c => c.id === item.id);
        if (subcategory) handleSubcategorySelect(subcategory);
      });
    }
  }

  function handleFilterChange(event: CustomEvent<{ options: FilterOptions }>) {
    filterOptions = event.detail.options;
    applySorting();
  }

  function applySorting() {
    if (!pinsItems.length) return;

    const sorted = [...pinsItems];

    // Determine if items are products or categories
    const isProducts = 'brand' in sorted[0];

    sorted.sort((a, b) => {
      let compareValue = 0;

      if (filterOptions.sortBy === 'name') {
        const aName = isProducts ? (a as Product).name : (a as Category).title;
        const bName = isProducts ? (b as Product).name : (b as Category).title;
        compareValue = aName.localeCompare(bName);
      }

      return filterOptions.sortOrder === 'asc' ? compareValue : -compareValue;
    });

    pinsItems = sorted;
  }

  async function handleContinueDesign(event: CustomEvent<{ selection: UserSelection }>) {
    // Navigate to design UI or emit event
    console.log('Continue with design:', event.detail.selection);
    // You would typically navigate to DesignUI here
    // For now, just log
  }
</script>

<AppCard>
  <!-- Breadcrumbs -->
  {#if breadcrumbs.length > 0}
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      {#each breadcrumbs as crumb, index}
        {#if index > 0}
          <ChevronRight size={16} class="breadcrumb-separator" />
        {/if}
        <button
          class="breadcrumb-item"
          on:click={() => handleBreadcrumbClick(crumb)}
        >
          {#if index === 0}
            <Home size={16} />
          {/if}
          <span>{crumb.title}</span>
        </button>
      {/each}
    </nav>
  {/if}

  <!-- Error Message -->
  {#if error}
    <div class="error-banner">
      <p>{error}</p>
      <button on:click={() => error = ''}>Dismiss</button>
    </div>
  {/if}

  <!-- Main View -->
  {#if view === 'main'}
    <CategoryCards
      categories={mainCategories}
      {loading}
      on:select={(e) => handleCategorySelect(e.detail.category)}
    />
  {/if}

  <!-- Subcategory View -->
  {#if view === 'subcategory' && subcategories.length > 0}
    <div class="subcategory-view">
      <SubcategoryChips
        {subcategories}
        selectedId={selectedSubcategory?.id || null}
        {loading}
        on:select={(e) => handleSubcategorySelect(e.detail.subcategory)}
      />
    </div>
  {/if}

  <!-- Pins View -->
  {#if view === 'pins'}
    <div class="pins-view">
      <SubcategoryChips
        {subcategories}
        selectedId={selectedSubcategory?.id || null}
        on:select={(e) => handleSubcategorySelect(e.detail.subcategory)}
      />
      
      <FilterSort
        options={filterOptions}
        on:change={handleFilterChange}
      />

      <PinsGrid
        items={pinsItems}
        type={'brand' in pinsItems[0] ? 'product' : 'category'}
        {loading}
        on:selectCategory={(e) => handlePinCategorySelect(e.detail.category)}
        on:selectProduct={(e) => handleProductSelect(e.detail.product)}
      />
    </div>
  {/if}

  <!-- Product Detail View -->
  {#if view === 'product' && selectedProduct}
    <ProductDetail
      product={selectedProduct}
      on:continue={handleContinueDesign}
    />
  {/if}
</AppCard>

<style>
  .breadcrumbs {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    margin-bottom: var(--spacing-6);
    padding-bottom: var(--spacing-4);
    border-bottom: 1px solid var(--color-border-primary);
    flex-wrap: wrap;
  }

  .breadcrumb-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    background: none;
    border: none;
    padding: var(--spacing-1) var(--spacing-2);
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-tertiary);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .breadcrumb-item:hover {
    background: var(--color-interactive-secondary);
    color: var(--color-text-primary);
  }

  .breadcrumb-item:last-child {
    color: var(--color-text-primary);
    font-weight: 600;
    cursor: default;
  }

  .breadcrumb-item:last-child:hover {
    background: none;
  }

  :global(.breadcrumb-separator) {
    color: var(--color-text-tertiary);
  }

  .error-banner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-4);
    background: var(--color-error-50);
    border: 1px solid var(--color-error-500);
    border-radius: var(--radius-lg);
    margin-bottom: var(--spacing-6);
    color: var(--color-error-600);
  }

  [data-theme="dark"] .error-banner {
    background: rgba(239, 68, 68, 0.1);
  }

  .error-banner button {
    background: none;
    border: none;
    color: var(--color-error-600);
    font-weight: 600;
    cursor: pointer;
    padding: var(--spacing-1) var(--spacing-2);
    border-radius: var(--radius-sm);
  }

  .error-banner button:hover {
    background: rgba(239, 68, 68, 0.1);
  }

  .subcategory-view,
  .pins-view {
    animation: fadeInUp 0.3s ease;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    .breadcrumbs {
      margin-bottom: var(--spacing-4);
      padding-bottom: var(--spacing-3);
    }

    .breadcrumb-item {
      font-size: 0.8125rem;
      padding: var(--spacing-1);
    }
  }
</style>