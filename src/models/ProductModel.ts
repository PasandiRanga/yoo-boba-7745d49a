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
  price: number;
  imageUrls: string[];
  category: string;
  weight: string;
  stock: number;
  featured: boolean;
  details: ProductDetails;
}