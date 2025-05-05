
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts, getProductsByCategory } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import ScrollAnimation from "@/components/animations/ScrollAnimations";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

const categories = [
  { id: "all", name: "All Products" },
  { id: "classic", name: "Classic Pearls" },
  { id: "specialty", name: "Specialty Pearls" },
  { id: "popping", name: "Popping Boba" },
];

const ProductsPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  // Fetch all products
  const { data: allProducts, isLoading: isLoadingAll } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts
  });

  // Fetch category-specific products when category changes
  const { data: categoryProducts, isLoading: isLoadingCategory } = useQuery({
    queryKey: ["products", activeCategory],
    queryFn: () => activeCategory === "all" 
      ? getAllProducts() 
      : getProductsByCategory(activeCategory),
    enabled: activeCategory !== "all" // Only run this query if we have a specific category
  });

  // Determine which products to display
  const products = activeCategory === "all" ? allProducts : categoryProducts;
  const isLoading = activeCategory === "all" ? isLoadingAll : isLoadingCategory;

  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
     
      <main className="flex-grow">
        <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 md:px-6">
            <ScrollAnimation animation="animate-reveal-text" className="text-center max-w-3xl mx-auto mb-12">
              <h1 className="text-3xl md:text-4xl font-bold font-display mb-4">
                Our Boba Pearl Collection
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Explore our premium selection of tapioca pearls and popping boba for your bubble tea shop.
              </p>
            </ScrollAnimation>

            <ScrollAnimation animation="animate-zoom-in" delay={300} className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
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
            </ScrollAnimation>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6].map((skeleton) => (
                  <div key={skeleton} className="flex flex-col space-y-3">
                    <Skeleton className="h-[300px] w-full rounded-xl" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products && products.map((product, index) => (
                  <ScrollAnimation 
                    key={product.id} 
                    animation="animate-zoom-in" 
                    threshold={0.1}
                    delay={100 * index}
                  >
                    <ProductCard product={product} />
                  </ScrollAnimation>
                ))}
              </div>
            )}

            {!isLoading && (!products || products.length === 0) && (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium">No products found</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
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
