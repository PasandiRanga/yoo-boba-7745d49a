import { CartItem } from "@/context/CartContext";
import { Separator } from "@/components/ui/separator";
import { useCurrency } from "@/context/CurrencyContext";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
}

const OrderSummary = ({ items, subtotal }: OrderSummaryProps) => {
  const { formatPrice } = useCurrency();
  
  // Calculate tax and total
  const shipping = subtotal > 100 ? 0 : 15; // Free shipping over $100
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax + shipping;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6 sticky top-20">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Order Summary</h2>
      
      <div className="divide-y dark:divide-gray-700">
        {items.map((item) => (
          <div key={item.id} className="py-3 flex justify-between">
            <div className="flex items-start">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-12 h-12 object-cover rounded mr-3 dark:brightness-95" 
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.quantity} x {formatPrice(item.price)}
                </p>
              </div>
            </div>
            <div className="text-right font-medium text-gray-900 dark:text-white">
              {formatPrice(item.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2 border-t dark:border-gray-700 pt-4">
        <div className="flex justify-between text-gray-900 dark:text-gray-300">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-900 dark:text-gray-300">
          <span>Shipping</span>
          <span>
            {shipping === 0 ? (
              <span className="text-green-600 dark:text-green-400">Free</span>
            ) : (
              formatPrice(shipping)
            )}
          </span>
        </div>
        <div className="flex justify-between text-gray-900 dark:text-gray-300">
          <span>Tax (8%)</span>
          <span>{formatPrice(tax)}</span>
        </div>
        <div className="border-t dark:border-gray-700 pt-2 mt-2 flex justify-between font-semibold text-gray-900 dark:text-white">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;