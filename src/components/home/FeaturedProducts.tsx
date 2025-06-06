import { fetchFeaturedProducts } from "@/services/productService";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ScrollAnimation from "@/components/animations/ScrollAnimations";
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Product } from "@/models/ProductModel";

// Styled gradient card wrapper
const StyledCardWrapper = styled.div`
  .card {
    width: 100%;
    height: 100%;
    border-radius: 0.35rem;
    transition: all .3s;
  }
  
  .card2 {
    width: 100%;
    height: 100%;
    background-color: transparent;
    border-radius: 0.35rem;
    transition: all .2s;
  }
  
  .card2:hover {
    transform: scale(0.995);
    border-radius: 0.35rem;
  }
  
  .card:hover {
    box-shadow: 0px 0px 0.07rem 0.07rem rgba(248, 112, 197, 0.07);
  }
`;

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setLoading(true);
        const products = await fetchFeaturedProducts();
        setFeaturedProducts(products);
      } catch (err) {
        console.error("Failed to fetch featured products:", err);
        setError("Failed to load featured products");
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  if (loading) return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6 text-center">
        Loading featured products...
      </div>
    </section>
  );
  
  if (error) return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6 text-center text-red-500">
        {error}
      </div>
    </section>
  );

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollAnimation animation="animate-reveal-text" className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 dark:text-white">
            Our Featured Products
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Discover our premium selection of boba pearls, crafted with the finest ingredients for an exceptional bubble tea experience.
          </p>
        </ScrollAnimation>
        
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <ScrollAnimation
                key={product.product_id}
                animation="animate-zoom-in"
                threshold={0.1}
                delay={200 * index}
              >
                <StyledCardWrapper className="bg-gradient-to-r from-[#5B6DF8] via-[#9B87F5] to-[#F870C5] rounded-lg dark:from-pink-900/40 dark:to-purple-900/40">
                  <div className="card">
                    <div className="card2">
                      <div className="p-0.5">
                        <ProductCard product={product} />
                      </div>
                    </div>
                  </div>
                </StyledCardWrapper>
              </ScrollAnimation>
            ))}
          </div>
        ) : (
          <p className="text-center dark:text-white">No featured products available at this time.</p>
        )}
        
        <ScrollAnimation animation="animate-reveal-text" delay={600} className="mt-12 text-center">
          <Link to="/products">
            <Button variant="slide" size="lg">View All Products</Button>
          </Link>
        </ScrollAnimation>
      </div>
    </section>
  );
};

export default FeaturedProducts;