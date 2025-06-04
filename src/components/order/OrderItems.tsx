import { CreditCard } from "lucide-react";
import { Order } from "@/types/order";

interface OrderItemsProps {
  order: Order;
}

export const OrderItems = ({ order }: OrderItemsProps) => {
  if (!order.items || order.items.length === 0) return null;

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 lg:col-span-2 border border-purple-200 dark:border-purple-800 relative overflow-hidden">
      <div className="flex items-center mb-6">
        <CreditCard className="h-6 w-6 text-purple-500 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Your Boba Order Items 🧋
        </h2>
      </div>
      <div className="space-y-4">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-4 px-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800 last:border-b-0 hover:shadow-md transition-shadow duration-200">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <p className="font-semibold text-gray-900 dark:text-white text-lg">{item.name}</p>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="bg-purple-100 dark:bg-purple-900/50 px-2 py-1 rounded-full">
                  Qty: {item.quantity}
                </span>
                <span className="text-purple-600 dark:text-purple-400 font-medium">
                  LKR {item.price.toFixed(2)} each
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                LKR {(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 