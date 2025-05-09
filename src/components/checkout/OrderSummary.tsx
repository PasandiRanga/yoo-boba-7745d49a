
import { CartItem } from "@/context/CartContext";
import { Separator } from "@/components/ui/separator";
import { useCurrency } from "@/context/CurrencyContext";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
}

const OrderSummary = ({ items, subtotal }: OrderSummaryProps) => {
  const { formatPrice } = useCurrency();
  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-20">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

      {/* Order Items */}
      <div className="space-y-4 mb-4">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden mr-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {item.quantity} × {formatPrice(item.price)}
                </p>
              </div>
            </div>
            <div className="font-medium">
              {formatPrice(item.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-4" />

      {/* Order Totals */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>
            {shipping === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              formatPrice(shipping)
            )}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Tax (8%)</span>
          <span>{formatPrice(tax)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
