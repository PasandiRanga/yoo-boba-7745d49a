import { useState, useEffect } from "react";
import { Product } from "@/models/ProductModel";
import { fetchProducts } from "@/services/productService";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import ScrollAnimation from "@/components/animations/ScrollAnimations";
import LoadingSpinner from "@/components/ui/loading-spinner";
import BackToTopButton from "@/components/ui/back-to-top";


const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products and scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const productsData = await fetchProducts();
        console.log(productsData);
        setProducts(productsData);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        // Add a slight delay to ensure smooth loading transition
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };

    loadProducts();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-background dark:bg-gray-900 text-foreground transition-colors duration-300">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Oops!</h2>
            <p className="text-red-500">{error}</p>
          </div>
        </main>
        <Footer />
        <BackToTopButton />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-gray-900 text-foreground transition-colors duration-300">
      <Navbar />
      
      <main className="flex-grow">
        <section className="py-12 md:py-16 bg-muted dark:bg-gray-800/50">
          <div className="container mx-auto px-4 md:px-6">
            <ScrollAnimation animation="animate-reveal-text" className="text-center max-w-3xl mx-auto mb-12">
              <h1 className="text-3xl md:text-4xl font-bold font-display mb-4">
                Our Boba Pearl Collection
              </h1>
              <p className="text-muted-foreground">
                Explore our premium selection of tapioca pearls and popping boba for your bubble tea shop.
              </p>
            </ScrollAnimation>
            
            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <ScrollAnimation
                    key={product.product_id}
                    animation="animate-zoom-in"
                    threshold={0.1}
                    delay={100 * index}
                  >
                    <ProductCard product={product} />
                  </ScrollAnimation>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No products available at this time.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default ProductsPage;