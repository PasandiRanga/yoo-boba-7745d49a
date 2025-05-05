
import { getFeaturedProducts } from "@/models/ProductModel";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ScrollAnimation from "@/components/animations/ScrollAnimations";

const FeaturedProducts = () => {
  const featuredProducts = getFeaturedProducts();

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollAnimation animation="animate-reveal-text" className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 dark:text-white">
            Our Featured Products
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Discover our premium selection of boba pearls, crafted with the finest ingredients for an exceptional bubble tea experience.
          </p>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product, index) => (
            <ScrollAnimation 
              key={product.id} 
              animation="animate-zoom-in" 
              threshold={0.1}
              delay={200 * index}
            >
              <ProductCard product={product} />
            </ScrollAnimation>
          ))}
        </div>

        <ScrollAnimation animation="animate-reveal-text" delay={600} className="mt-12 text-center">
          <Button asChild variant="outline" size="lg" className="dark:text-white dark:border-gray-700 dark:hover:bg-gray-800">
            <Link to="/products">View All Products</Link>
          </Button>
        </ScrollAnimation>
      </div>
    </section>
  );
};

export default FeaturedProducts;
