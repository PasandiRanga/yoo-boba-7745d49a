import { MapPin } from "lucide-react";
import { Address } from "@/types/order";
import { formatAddress } from "@/utils/orderUtils";

interface AddressInfoProps {
  address: Address;
  type: "shipping" | "billing";
}

export const AddressInfo = ({ address, type }: AddressInfoProps) => {
  const isShipping = type === "shipping";
  const iconColor = isShipping ? "text-blue-500" : "text-green-500";
  const bgColor = isShipping ? "bg-blue-50 dark:bg-blue-900/20" : "bg-green-50 dark:bg-green-900/20";
  const borderColor = isShipping ? "border-blue-200 dark:border-blue-800" : "border-green-200 dark:border-green-800";
  const title = isShipping ? "Shipping Address 🚚" : "Billing Address 💳";

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-purple-200 dark:border-purple-800 relative overflow-hidden">
      <div className="flex items-center mb-4">
        <MapPin className={`h-6 w-6 ${iconColor} mr-3`} />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
      </div>
      <p className={`text-gray-700 dark:text-gray-300 leading-relaxed ${bgColor} p-3 rounded-lg border ${borderColor}`}>
        {formatAddress(address)}
      </p>
    </div>
  );
}; 