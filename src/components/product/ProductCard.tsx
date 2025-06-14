import { Link } from "react-router-dom";
import { Product } from "@/models/ProductModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import styled from "styled-components";

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
    transform: scale(0.99);
    border-radius: 0.35rem;
  }
  
  .card:hover {
    box-shadow: 0px 0px 0.07rem 0.07rem rgba(248, 112, 197, 0.07);
  }
`;

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  console.log({ productId: product.product_id });
  return (
    <Link to={`/products/${product.product_id}`}>
      <StyledCardWrapper className="bg-gradient-to-r from-[#5B6DF8] via-[#9B87F5] to-[#F870C5] rounded-lg dark:from-pink-900/40 dark:to-purple-900/40">
        <div className="card">
          <div className="card2">
            <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg group product-card bg-gradient-to-br from-pink-50 to-white dark:from-pink-900/20 dark:to-gray-900/80 dark:text-white">
              {/* Horizontal Layout */}
              <div className="flex flex-col md:flex-row h-full">
                {/* Image Section */}
                <div className="w-full md:w-1/3 h-64 md:h-auto overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
                  <img
                    src={product.imageUrls[0]}
                    alt={product.name}
                    className="h-full w-full object-cover product-card-image transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                
                {/* Content Section */}
                <div className="flex-1 flex flex-col">
                  <CardContent className="p-6 flex-1">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-2xl mb-2">{product.name}</h3>
                        <p className="text-muted-foreground line-clamp-3 text-base">
                          {product.description}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-sm text-gray-500 dark:text-gray-400">Flavor</span>
                          <span className="text-sm font-medium">
                            {product.details.flavor}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm text-gray-500 dark:text-gray-400">Color</span>
                          <span className="text-sm font-medium">
                            {product.details.color}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm text-gray-500 dark:text-gray-400">Texture</span>
                          <span className="text-sm font-medium">
                            {product.details.texture}
                          </span>
                        </div>
                      </div>
                      
                      {/* Variants/Pricing */}
                      {product.variants && product.variants.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {product.variants.slice(0, 3).map((variant, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full"
                            >
                              {variant.weight}
                            </span>
                          ))}
                          {product.variants.length > 3 && (
                            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full">
                              +{product.variants.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-6 pt-0">
                    <Button
                      variant="default"
                      className="w-full md:w-auto bg-yooboba-gradient hover:opacity-90"
                    >
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </StyledCardWrapper>
    </Link>
  );
};

export default ProductCard;