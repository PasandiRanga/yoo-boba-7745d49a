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
              <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
                <img
                  src={product.imageUrls[0]}
                  alt={product.name}
                  className="h-full w-full object-cover product-card-image transition-transform duration-500 group-hover:scale-110 group-hover:translate-y-[-8px]"
                />
              </div>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                </div>
                <div className="mt-4">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <span className="font-medium text-xs">Flavor:</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {product.details.flavor}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-xs">Color:</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {product.details.color}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-xs">Texture:</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {product.details.texture}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button
                  variant="default"
                  className="w-full bg-yooboba-gradient hover:opacity-90"
                >
                  View Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </StyledCardWrapper>
    </Link>
  );
};

export default ProductCard;