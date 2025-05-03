
import { Button } from "@/components/ui/button";

const EmptyCart = () => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
      <p className="mb-6">Add some products to your cart before proceeding to checkout.</p>
      <Button asChild>
        <a href="/products">Browse Products</a>
      </Button>
    </div>
  );
};

export default EmptyCart;
