
import { getFeaturedProducts } from "@/models/ProductModel";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FeaturedProducts = () => {
  const featuredProducts = getFeaturedProducts();

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            Our Featured Products
          </h2>
          <p className="text-gray-600">
            Discover our premium selection of boba pearls, crafted with the finest ingredients for an exceptional bubble tea experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/products">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
