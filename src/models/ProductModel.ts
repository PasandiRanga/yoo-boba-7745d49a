export interface ProductDetails {
  color: string;
  flavor: string;
  texture: string;
  cookingTime: string;
  ingredients: string[];
  storageInstructions: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrls: string[];
  featured: boolean;
  details: ProductDetails;
  category: string;
}