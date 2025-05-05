
import { Link } from "react-router-dom";
import { Product } from "@/models/ProductModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images && product.images.length > 0 ? product.images[0] : "",
      weight: product.weight
    });
  };

  // Get first image or use fallback
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : "https://via.placeholder.com/400x400?text=No+Image";

  return (
    <Link to={`/products/${product.id}`}>
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg group product-card">
        <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover product-card-image"
            onError={(e) => {
              // Fallback if image fails to load
              (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x400?text=Image+Error";
            }}
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
              ${product.price.toFixed(2)}
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
            disabled={product.stock <= 0}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;
