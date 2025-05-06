export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  weight: string;
  stock: number;
  featured: boolean;
  attributes: {
    flavor?: string;
    color?: string;
    texture?: string;
    cookingTime?: string;
    storageInstructions?: string;
    ingredients?: string[];
  };
}

// Mock data for products (fallback when DB not available)
export const products: Product[] = [
  // ... (keep your existing mock data)
];

// Local data fallback functions
export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};