export interface Category {
  id: number;
  parent_id: number | null;
  image_url: string;
  title: string;
  _links: {
    self: { href: string };
  };
}

export interface ProductColor {
  name: string;
  value: string;
}

export interface Product {
  id: number;
  type: string;
  main_category_id: number;
  name: string;
  brand: string;
  model: string;
  image: string;
  variant_count: number;
  is_discontinued: boolean;
  description: string;
  sizes: string[];
  colors: ProductColor[];
  techniques: Technique[];
  placements: Placement[];
  product_options: ProductOption[];
}

export interface Technique {
  key: string;
  display_name: string;
  is_default: boolean;
}

export interface LayerOption {
  name: string;
  techniques: string[];
  type: string;
  values: Record<string, string> | string[];
}

export interface Layer {
  type: string;
  layer_options: LayerOption[];
}

export interface Placement {
  placement: string;
  technique: string;
  layers: Layer[];
  placement_options: PlacementOption[];
  conflicting_placements: string[];
}

export interface PlacementOption {
  name: string;
  techniques: string[];
  type: string;
  values: string[];
}

export interface ProductOption {
  name: string;
  techniques: string[];
  type: string;
  values: (boolean | string)[];
}

export interface PlacementDimension {
  placement: string;
  height: number;
  width: number;
  orientation: string;
}

export interface CatalogVariant {
  id: number;
  catalog_product_id: number;
  name: string;
  size: string;
  color: string;
  color_code: string;
  image: string;
  placement_dimensions: PlacementDimension[];
}

export interface PricingTechnique {
  technique_key: string;
  technique_display_name: string;
  price: string;
  discounted_price: string;
}

export interface PricingVariant {
  id: number;
  techniques: PricingTechnique[];
}

export interface PricingPlacement {
  id: string;
  title: string;
  type: string;
  technique_key: string;
  price: string;
  discounted_price: string;
  layers: Array<{
    type: string;
    additional_price: string;
  }>;
}

export interface ProductPricing {
  currency: string;
  product: {
    id: number;
    placements: PricingPlacement[];
  };
  variants: PricingVariant[];
}

export interface BreadcrumbItem {
  id: number;
  title: string;
  type: 'main' | 'subcategory' | 'product';
}

export interface UserSelection {
  color: string;
  size: string;
  placement: Placement;
  variant_id: number;
  dimensions: PlacementDimension;
  pricing: {
    base_price: number;
    retail_price: number;
    technique_price: number;
    placement_price: number;
  };
}

export interface FilterOptions {
  sortBy: 'name' | 'price' | 'popular';
  sortOrder: 'asc' | 'desc';
}
