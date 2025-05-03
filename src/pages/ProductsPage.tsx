
import { useState } from "react";
import { products, getProductsByCategory } from "@/models/ProductModel";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";

const categories = [
  { id: "all", name: "All Products" },
  { id: "classic", name: "Classic Pearls" },
  { id: "specialty", name: "Specialty Pearls" },
  { id: "popping", name: "Popping Boba" },
];

const ProductsPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProducts = activeCategory === "all" 
    ? products 
    : getProductsByCategory(activeCategory);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h1 className="text-3xl md:text-4xl font-bold font-display mb-4">
                Our Boba Pearl Collection
              </h1>
              <p className="text-gray-600">
                Explore our premium selection of tapioca pearls and popping boba for your bubble tea shop.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  className={activeCategory === category.id ? "bg-yooboba-gradient" : ""}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium">No products found</h3>
                <p className="text-gray-600 mt-2">
                  Try selecting a different category or check back later.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;
