import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyCartProps {
  message?: string;
}

const EmptyCart = ({ message = "Your cart is empty" }: EmptyCartProps) => {
  return (
    <div className="text-center py-16">
      <div className="mx-auto w-16 h-16 mb-6 text-gray-400 dark:text-gray-500">
        <ShoppingCart size={64} />
      </div>
      <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{message}</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Add some products to your cart before proceeding to checkout.
      </p>
      <Button asChild className="bg-yooboba-gradient hover:opacity-90 dark:shadow-glow-sm">
        <Link to="/products">Browse Products</Link>
      </Button>
    </div>
  );
};

export default EmptyCart;