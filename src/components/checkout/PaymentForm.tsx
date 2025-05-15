// File: src/components/checkout/PaymentForm.tsx
import { Label } from "@/components/ui/label";
import { CreditCard, ShoppingBag, Wallet } from "lucide-react";

interface PaymentFormProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

const PaymentForm = ({
  paymentMethod,
  setPaymentMethod,
}: PaymentFormProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
      <div className="space-y-4">
        <div className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
          <input
            type="radio"
            id="payhere"
            name="paymentMethod"
            value="payhere"
            checked={paymentMethod === "payhere"}
            onChange={() => setPaymentMethod("payhere")}
            className="mr-3"
          />
          <CreditCard className="h-5 w-5 text-blue-600 mr-3" />
          <Label htmlFor="payhere" className="cursor-pointer flex-grow">
            Credit/Debit Card or Online Banking (PayHere)
          </Label>
        </div>
        
        {paymentMethod === "payhere" && (
          <div className="p-4 bg-gray-50 rounded-md border border-gray-200 ml-8">
            <p className="text-sm text-gray-600">
              You will be redirected to PayHere's secure payment gateway to complete your purchase. PayHere accepts Visa, Mastercard, American Express, and online banking options from major Sri Lankan banks.
            </p>
          </div>
        )}
        
        <div className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
          <input
            type="radio"
            id="cash_on_delivery"
            name="paymentMethod"
            value="cash_on_delivery"
            checked={paymentMethod === "cash_on_delivery"}
            onChange={() => setPaymentMethod("cash_on_delivery")}
            className="mr-3"
          />
          <ShoppingBag className="h-5 w-5 text-green-600 mr-3" />
          <Label htmlFor="cash_on_delivery" className="cursor-pointer flex-grow">
            Cash on Delivery
          </Label>
        </div>
        
        <div className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
          <input
            type="radio"
            id="bank_transfer"
            name="paymentMethod"
            value="bank_transfer"
            checked={paymentMethod === "bank_transfer"}
            onChange={() => setPaymentMethod("bank_transfer")}
            className="mr-3"
          />
          <Wallet className="h-5 w-5 text-purple-600 mr-3" />
          <Label htmlFor="bank_transfer" className="cursor-pointer flex-grow">
            Direct Bank Transfer
          </Label>
        </div>
        
        {paymentMethod === "bank_transfer" && (
          <div className="p-4 bg-gray-50 rounded-md border border-gray-200 ml-8">
            <p className="text-sm text-gray-600 mb-2">
              Please transfer the total amount to our bank account. Your order will be processed after the payment is confirmed.
            </p>
            <div className="text-sm">
              <p><span className="font-semibold">Bank:</span> Bank of Ceylon</p>
              <p><span className="font-semibold">Account Name:</span> Your Company Name</p>
              <p><span className="font-semibold">Account Number:</span> 123456789</p>
              <p><span className="font-semibold">Branch:</span> Colombo</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentForm;