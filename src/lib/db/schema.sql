
-- Drop tables if they exist
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS products;

-- Create products table
CREATE TABLE products (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  category VARCHAR(50) NOT NULL,
  weight VARCHAR(50) NOT NULL,
  images TEXT[] NOT NULL,
  attributes JSONB NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create customers table
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  company VARCHAR(100),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create addresses table
CREATE TABLE addresses (
  id SERIAL PRIMARY KEY,
  street1 VARCHAR(100) NOT NULL,
  street2 VARCHAR(100),
  city VARCHAR(50) NOT NULL,
  state VARCHAR(50) NOT NULL,
  zip_code VARCHAR(20) NOT NULL,
  country VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id VARCHAR(50) PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  shipping_address_id INTEGER NOT NULL REFERENCES addresses(id),
  billing_address_id INTEGER NOT NULL REFERENCES addresses(id),
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) NOT NULL,
  shipping DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  payment_status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(50) NOT NULL REFERENCES orders(id),
  product_id VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Insert sample products
INSERT INTO products (id, name, description, price, stock, category, weight, images, attributes, featured)
VALUES
  (
    'classic-black', 
    'Classic Black Boba Pearls', 
    'Our signature black tapioca pearls for an authentic bubble tea experience.', 
    19.99, 
    100, 
    'classic', 
    '1kg', 
    ARRAY['https://placehold.co/600x400.png'], 
    '{"texture": "Soft and chewy", "flavor": "Mild sweetness", "color": "Black", "cookingTime": "20-25 minutes", "storageInstructions": "Store in a cool, dry place", "ingredients": ["Tapioca Starch", "Brown Sugar", "Water"]}',
    true
  ),
  (
    'brown-sugar', 
    'Brown Sugar Boba Pearls', 
    'Rich and caramel-like brown sugar tapioca pearls for a delicious bubble tea experience.', 
    24.99, 
    75, 
    'specialty', 
    '1kg', 
    ARRAY['https://placehold.co/600x400.png'], 
    '{"texture": "Soft with caramel notes", "flavor": "Rich brown sugar", "color": "Dark brown", "cookingTime": "15-20 minutes", "storageInstructions": "Store in a cool, dry place", "ingredients": ["Tapioca Starch", "Brown Sugar", "Molasses", "Water"]}',
    true
  ),
  (
    'mango-popping', 
    'Mango Popping Boba', 
    'Bursting with real mango juice, these popping boba add a tropical twist to any drink.', 
    29.99, 
    50, 
    'popping', 
    '1kg', 
    ARRAY['https://placehold.co/600x400.png'], 
    '{"texture": "Thin gel with liquid burst", "flavor": "Sweet mango", "color": "Orange-yellow", "cookingTime": "Ready to use", "storageInstructions": "Refrigerate after opening", "ingredients": ["Water", "Mango Juice", "Calcium Lactate", "Sodium Alginate", "Citric Acid", "Natural Flavors"]}',
    true
  );
