import type {
  Category,
  Product,
  CatalogVariant,
  ProductPricing,
  UserSelection
} from '$lib/types/catalog';

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

class CatalogApi {
  private baseUrl = '/api/printful/v2';

  private getCacheKey(url: string): string {
    return url;
  }

  private getFromCache<T>(key: string): T | null {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data as T;
    }
    cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any): void {
    cache.set(key, { data, timestamp: Date.now() });
  }

  private async request<T>(endpoint: string, useCache = true): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const cacheKey = this.getCacheKey(url);

    if (useCache) {
      const cached = this.getFromCache<T>(cacheKey);
      if (cached) return cached;
    }

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    if (useCache) {
      this.setCache(cacheKey, result);
    }

    return result;
  }

  /**
   * Fetch all categories with pagination handling
   */
  async getAllCategories(): Promise<Category[]> {
    const allCategories: Category[] = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
      const response = await this.request<{
        data: Category[];
        paging: { total: number; limit: number; offset: number };
      }>(`/catalog-categories?limit=${limit}&offset=${offset}`);

      allCategories.push(...response.data);
      
      offset += limit;
      hasMore = offset < response.paging.total;
    }

    return allCategories;
  }

  /**
   * Get main categories (parent_id is null)
   */
  async getMainCategories(): Promise<Category[]> {
    const mainIds = [1, 2, 3, 5]; // Men's, Women's, Young, Home & Living
    const allCategories = await this.getAllCategories();
    return allCategories.filter(cat => mainIds.includes(cat.id));
  }

  /**
   * Get subcategories by parent ID
   */
  async getSubcategories(parentId: number): Promise<Category[]> {
    const allCategories = await this.getAllCategories();
    return allCategories.filter(cat => cat.parent_id === parentId);
  }

  /**
   * Check if category has children
   */
  async hasChildren(categoryId: number): Promise<boolean> {
    const children = await this.getSubcategories(categoryId);
    return children.length > 0;
  }

  /**
   * Get products by category ID with pagination
   */
  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    const allProducts: Product[] = [];
    let offset = 0;
    const limit = 20;
    let hasMore = true;

    while (hasMore) {
      const response = await this.request<{
        data: Product[];
        paging: { total: number; limit: number; offset: number };
      }>(`/catalog-products?category_ids=${categoryId}&limit=${limit}&offset=${offset}`);

      allProducts.push(...response.data);
      
      offset += limit;
      hasMore = offset < response.paging.total;
    }

    return allProducts;
  }

  /**
   * Get product details by ID
   */
  async getProduct(productId: number): Promise<Product> {
    const response = await this.request<{ data: Product }>(
      `/catalog-products/${productId}`
    );
    return response.data;
  }

  /**
   * Get catalog variants for a product with size/color filtering
   */
  async getProductVariants(
    productId: number,
    size?: string,
    color?: string
  ): Promise<CatalogVariant[]> {
    const allVariants: CatalogVariant[] = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
      const response = await this.request<{
        data: CatalogVariant[];
        paging: { total: number; limit: number; offset: number };
      }>(`/catalog-products/${productId}/catalog-variants?limit=${limit}&offset=${offset}`);

      allVariants.push(...response.data);
      
      offset += limit;
      hasMore = offset < response.paging.total;
    }

    // Filter by size and color if provided
    let filtered = allVariants;
    if (size) {
      filtered = filtered.filter(v => v.size === size);
    }
    if (color) {
      filtered = filtered.filter(v => v.color === color);
    }

    return filtered;
  }

  /**
   * Get pricing for a product
   */
  async getProductPricing(productId: number): Promise<ProductPricing> {
    const response = await this.request<{ data: ProductPricing }>(
      `/catalog-products/${productId}/prices`,
      false // Don't cache pricing
    );
    return response.data;
  }

  /**
   * Calculate final retail price
   * Formula: (technique_price + placement_price) + $30 markup
   */
  calculatePrice(
    pricing: ProductPricing,
    techniqueKey: string,
    placementId: string
  ): { base: number; retail: number; technique: number; placement: number } | null {
    try {
      // Find technique price from variants
      const variant = pricing.variants[0]; // Using first variant as base
      const technique = variant?.techniques.find(t => t.technique_key === techniqueKey);
      const techniquePrice = technique ? parseFloat(technique.price) : 0;

      // Find placement price
      const placement = pricing.product.placements.find(p => p.id === placementId);
      const placementPrice = placement ? parseFloat(placement.price) : 0;

      const basePrice = techniquePrice + placementPrice;
      const retailPrice = basePrice + 30;

      return {
        base: basePrice,
        retail: retailPrice,
        technique: techniquePrice,
        placement: placementPrice
      };
    } catch (error) {
      console.error('Price calculation error:', error);
      return null;
    }
  }

  /**
   * Submit product selection to FastAPI backend
   */
  async submitProductSelection(
    product: Product,
    selection: UserSelection
  ): Promise<void> {
    const { apiClient } = await import('./client');
    
    await apiClient.submitProductSelection(
      {
        id: product.id,
        name: product.name,
        brand: product.brand,
        description: product.description,
        sizes: product.sizes,
        colors: product.colors
      },
      {
        color: selection.color,
        size: selection.size,
        placement: selection.placement,
        variant_id: selection.variant_id,
        placement_dimensions: selection.dimensions,
        pricing: selection.pricing
      }
    );
  }
}

export const catalogApi = new CatalogApi();
