
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

// Mock data for products
export const products: Product[] = [
  {
    id: "1",
    name: "Black Tapioca Pearls",
    description: "Our signature black tapioca pearls in vanila flavour with the perfect chewy texture. Made from premium cassava starch, these classic boba pearls are perfect for traditional bubble tea drinks.",
    price: 15.99,
    images: [
      "./../../public/images/black.png",
    ],
    category: "classic",
    weight: "250g",
    stock: 100,
    featured: true,
    attributes: {
      flavor: "Vanilla",
      color: "Black",
      texture: "Chewy",
      cookingTime: "30 minutes",
      storageInstructions: "Store in a cool, dry place. Once opened, refrigerate for up to 7 days.",
      ingredients: ["Cassava starch", "Brown sugar", "Water" , "Vanilla extract"],
    },
  },
  {
    id: "2",
    name: "Chocolate Boba",
    description: "Luxurious boba pearls with a rich chocolate flavor. These pearls are perfect for your chocolate milk tea or any drink that could use a sweet chocolate touch.",
    price: 18.99,
    images: [
      "./../../public/images/choco.png",
    ],
    category: "specialty",
    weight: "250g",
    stock: 85,
    featured: true,
    attributes: {
      flavor: "Chocolate",
      color: "Dark Brown",
      texture: "Soft and Chewy",
      cookingTime: "25 minutes",
      storageInstructions: "Store in a cool, dry place. Once opened, refrigerate for up to 7 days.",
      ingredients: ["Cassava starch", "Premium brown sugar", "Water" , "Cocoa powder"],
    },
  },
  {
    id: "3",
    name: "Pink Boba",
    description: "Sweet strawberry-flavored boba pearls that add a fruity burst to your drinks. Made with real strawberry extract for an authentic flavor. These pink pearls are a visual delight and taste sensation in fruit teas and smoothies.",
    price: 22.99,
    images: [
      "./../../public/images/pink.png",
    ],
    category: "popping",
    weight: "250g",
    stock: 60,
    featured: true,
    attributes: {
      flavor: "Assorted Fruit",
      color: "Rainbow",
      texture: "Soft and Chewy",
      cookingTime: "25 minutes",
      storageInstructions: "Refrigerate at all times. Use within 14 days of opening.",
      ingredients: ["Cassava starch", "Premium brown sugar", "Water" , "Cocoa powder"],
    },
  },
  {
    id: "4",
    name: "Black, Pink, Chocolate 3 in one",
    description: "All 3 flavours to fit your liking.",
    price: 19.99,
    images: [
      "./../../public/images/all.png",
    ],
    category: "specialty",
    weight: "750g",
    stock: 75,
    featured: false,
    attributes: {
      flavor: "All 3 flavours",
      color: "Black Pink Brown",
      texture: "Soft and Chewy",
      cookingTime: "25 minutes",
      storageInstructions: "Refrigerate after opening. Use within 5 days.",
      ingredients: ["Cassava starch", "Premium brown sugar", "Water" , "Cocoa powder"],
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
