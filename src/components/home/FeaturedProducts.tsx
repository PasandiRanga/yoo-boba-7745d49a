
import { useQuery } from "@tanstack/react-query";
import { getFeaturedProducts } from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ScrollAnimation from "@/components/animations/ScrollAnimations";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedProducts = () => {
  const { data: featuredProducts, isLoading, error } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: getFeaturedProducts,
  });

  // Loading skeleton
  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} className="h-96 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    console.error("Error loading featured products:", error);
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600">
            We couldn't load our featured products. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  // If no featured products
  if (!featuredProducts || featuredProducts.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            Featured Products Coming Soon
          </h2>
          <p className="text-gray-600">
            Check back soon to see our featured boba products!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollAnimation animation="animate-reveal-text" className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            Our Featured Products
          </h2>
          <p className="text-gray-600">
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
          <Button asChild variant="outline" size="lg">
            <Link to="/products">View All Products</Link>
          </Button>
        </ScrollAnimation>
      </div>
    </section>
  );
};

export default FeaturedProducts;
