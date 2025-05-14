export interface ProductVariant {
  weight: string;
  price: number;
  stock: number;
}

export interface ProductDetails {
  color: string;
  flavor: string;
  texture: string;
  cookingTime: string;
  ingredients: string[];
  storageInstructions: string;
  category?: string;
}

export interface Product {
  product_id: string;
  name: string;
  description: string;
  price: number;
  weight: string;
  stock: number;
  category: string;
  imageUrls: string[];
  details: ProductDetails;
  isActive: boolean;
  variants: ProductVariant[];
  fatured: boolean;
}