
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
  available?: boolean;
  attributes: {
    flavor?: string;
    color?: string;
    texture?: string;
    cookingTime?: string;
    storageInstructions?: string;
    ingredients?: string[];
    specs?: Record<string, any>;
  };
}

// Mock data for products
export const products: Product[] = [
  {
    id: "1",
    name: "Classic Tapioca Pearls",
    description: "Our signature black tapioca pearls with the perfect chewy texture. Made from premium cassava starch, these classic boba pearls are perfect for traditional bubble tea drinks.",
    price: 15.99,
    images: [
      "https://images.unsplash.com/photo-1558857563-c0c8b5962dc6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    ],
    category: "classic",
    weight: "1kg",
    stock: 100,
    featured: true,
    attributes: {
      flavor: "Traditional",
      color: "Black",
      texture: "Chewy",
      cookingTime: "30 minutes",
      storageInstructions: "Store in a cool, dry place. Once opened, refrigerate for up to 7 days.",
      ingredients: ["Cassava starch", "Brown sugar", "Water"],
    },
  },
  {
    id: "2",
    name: "Brown Sugar Pearls",
    description: "Luxurious brown sugar boba pearls with a rich caramel flavor. These pearls are perfect for brown sugar milk tea or any drink that could use a sweet caramel touch.",
    price: 18.99,
    images: [
      "https://images.unsplash.com/photo-1588653818221-2651deed55cc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
    ],
    category: "specialty",
    weight: "1kg",
    stock: 85,
    featured: true,
    attributes: {
      flavor: "Brown Sugar boba",
      color: "Dark Brown",
      texture: "Soft and Chewy",
      cookingTime: "25 minutes",
      storageInstructions: "Store in a cool, dry place. Once opened, refrigerate for up to 7 days.",
      ingredients: ["Cassava starch", "Premium brown sugar", "Water"],
    },
  },
  {
    id: "3",
    name: "Rainbow Popping Pearls",
    description: "Colorful bursting boba pearls in assorted fruit flavors. These pearls add a burst of fruit flavor and visual appeal to any drink or dessert.",
    price: 22.99,
    images: [
      "https://images.unsplash.com/photo-1542704792-e30dac463c90?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    ],
    category: "popping",
    weight: "1kg",
    stock: 60,
    featured: true,
    attributes: {
      flavor: "Assorted Fruit",
      color: "Rainbow",
      texture: "Bursting",
      cookingTime: "No cooking required",
      storageInstructions: "Refrigerate at all times. Use within 14 days of opening.",
      ingredients: ["Fruit juices", "Seaweed extract", "Calcium chloride", "Natural flavors"],
    },
  },
  {
    id: "4",
    name: "Crystal Boba",
    description: "Clear, white pearls with a jelly-like texture. Made from agar and konnyaku jelly, they're ideal for lighter drinks where you want the boba texture without the dark color.",
    price: 19.99,
    images: [
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    ],
    category: "specialty",
    weight: "1kg",
    stock: 75,
    featured: false,
    attributes: {
      flavor: "Subtle Sweet",
      color: "Clear/White",
      texture: "Jelly-like",
      cookingTime: "15 minutes",
      storageInstructions: "Refrigerate after opening. Use within 5 days.",
      ingredients: ["Konjac", "Agar", "Cane sugar", "Water"],
    },
  },
  {
    id: "5",
    name: "Honey Boba",
    description: "Tapioca pearls infused with natural honey flavor. A perfect balance of sweetness and the classic chewy texture that boba lovers crave.",
    price: 21.99,
    images: [
      "https://images.unsplash.com/photo-1625349266648-1c31478dac1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    ],
    category: "specialty",
    weight: "1kg",
    stock: 70,
    featured: false,
    attributes: {
      flavor: "Honey",
      color: "Golden Brown",
      texture: "Chewy",
      cookingTime: "30 minutes",
      storageInstructions: "Store in a cool, dry place. Once opened, refrigerate for up to 7 days.",
      ingredients: ["Cassava starch", "Natural honey", "Cane sugar", "Water"],
    },
  },
  {
    id: "6",
    name: "Mini Tapioca Pearls",
    description: "Small-sized classic black pearls, perfect for desserts or when you want a more delicate boba experience.",
    price: 16.99,
    images: [
      "https://images.unsplash.com/photo-1541696490-8744a5dc0228?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    ],
    category: "classic",
    weight: "1kg",
    stock: 90,
    featured: false,
    attributes: {
      flavor: "Traditional",
      color: "Black",
      texture: "Chewy",
      cookingTime: "20 minutes",
      storageInstructions: "Store in a cool, dry place. Once opened, refrigerate for up to 7 days.",
      ingredients: ["Cassava starch", "Brown sugar", "Water"],
    },
  },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

// New function to get available products
export const getAvailableProducts = (): Product[] => {
  return products.filter(product => product.available !== false);
};
