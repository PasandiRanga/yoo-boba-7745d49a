import { Package } from "lucide-react";
import { Order } from "@/types/order";
import { capitalize } from "@/utils/orderUtils";

interface OrderSummaryProps {
  order: Order;
}

export const OrderSummary = ({ order }: OrderSummaryProps) => {
  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-purple-200 dark:border-purple-800 relative overflow-hidden">
      <div className="flex items-center mb-4">
        <Package className="h-6 w-6 text-purple-500 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Order Summary ✨
        </h2>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
          <span className="font-medium text-gray-700 dark:text-gray-300">Order Number:</span>
          <span className="text-gray-900 dark:text-white font-mono bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded">{order.id}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
          <span className="font-medium text-gray-700 dark:text-gray-300">Date:</span>
          <span className="text-gray-900 dark:text-white">
            {new Date(order.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
          <span className="font-medium text-gray-700 dark:text-gray-300">Status:</span>
          <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-800 dark:to-emerald-800 dark:text-green-100 rounded-full text-sm font-medium border border-green-200 dark:border-green-700">
            {capitalize(order.status)} 🚀
          </span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
          <span className="font-medium text-gray-700 dark:text-gray-300">Payment Method:</span>
          <span className="text-gray-900 dark:text-white">
            {order.paymentMethod ? order.paymentMethod.replace('_', ' ').toUpperCase() : 'N/A'} 💳
          </span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
          <span className="font-medium text-gray-700 dark:text-gray-300">Payment Status:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
            order.paymentStatus === 'paid'
              ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200 dark:from-green-800 dark:to-emerald-800 dark:text-green-100 dark:border-green-700'
              : order.paymentStatus === 'pending'
              ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200 dark:from-yellow-800 dark:to-orange-800 dark:text-yellow-100 dark:border-yellow-700'
              : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200 dark:from-red-800 dark:to-pink-800 dark:text-red-100 dark:border-red-700'
          }`}>
            {capitalize(order.paymentStatus)} {order.paymentStatus === 'paid' ? '✅' : '⏳'}
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="font-medium text-gray-700 dark:text-gray-300">Total Amount:</span>
          <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            LKR {order.total?.toFixed(2)} 🧾
          </span>
        </div>
      </div>
    </div>
  );
}; 