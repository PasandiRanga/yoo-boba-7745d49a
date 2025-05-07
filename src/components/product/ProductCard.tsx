
import { Link } from "react-router-dom";
import { Product } from "@/models/ProductModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";

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
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.imageUrls[0],
      weight: product.weight
    });
  };

  return (
    <Link to={`/products/${product.id}`}>
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
                <div className="mt-4 flex items-center justify-between">
                  <div className="font-semibold">
                    {formatPrice(product.price)}
                    <span className="ml-2 text-xs text-muted-foreground">
                      {product.weight}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {product.stock > 0 ? (
                      <span className="text-green-600 dark:text-green-400">In Stock</span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400">Out of Stock</span>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button
                  onClick={handleAddToCart}
                  variant="default"
                  className="w-full bg-yooboba-gradient hover:opacity-90"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
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
