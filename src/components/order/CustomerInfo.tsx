import { User } from "lucide-react";
import { Order } from "@/types/order";
import { getCustomerName, getCustomerEmail, getCustomerPhone } from "@/utils/orderUtils";

interface CustomerInfoProps {
  order: Order;
}

export const CustomerInfo = ({ order }: CustomerInfoProps) => {
  const { customer, isGuestOrder } = order;

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-purple-200 dark:border-purple-800 relative overflow-hidden">
      <div className="flex items-center mb-4">
        <User className="h-6 w-6 text-pink-500 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Customer Information 👤
        </h2>
        {isGuestOrder && (
          <span className="ml-2 px-2 py-1 bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-800 dark:from-orange-800 dark:to-yellow-800 dark:text-orange-100 rounded-full text-xs border border-orange-200 dark:border-orange-700">
            Guest ✨
          </span>
        )}
      </div>
      <div className="space-y-3">
        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
          <span className="font-medium text-gray-700 dark:text-gray-300">Name:</span>
          <span className="text-gray-900 dark:text-white">{getCustomerName(customer, isGuestOrder)}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
          <span className="font-medium text-gray-700 dark:text-gray-300">Email:</span>
          <span className="text-gray-900 dark:text-white">{getCustomerEmail(customer)}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="font-medium text-gray-700 dark:text-gray-300">Phone:</span>
          <span className="text-gray-900 dark:text-white">{getCustomerPhone(customer)}</span>
        </div>
        {customer?.company && (
          <div className="flex justify-between py-2 border-t border-gray-200 dark:border-gray-600">
            <span className="font-medium text-gray-700 dark:text-gray-300">Company:</span>
            <span className="text-gray-900 dark:text-white">{customer.company}</span>
          </div>
        )}
      </div>
    </div>
  );
}; 