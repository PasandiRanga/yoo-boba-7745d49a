import { Label } from "@/components/ui/label";

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
        <div className="flex items-center mb-4">
          <input
            type="radio"
            id="credit_card"
            name="paymentMethod"
            value="credit_card"
            checked={paymentMethod === "credit_card"}
            onChange={() => setPaymentMethod("credit_card")}
            className="mr-2"
          />
          <Label htmlFor="credit_card">Credit Card (Redirects to payment portal)</Label>
        </div>
        
        {paymentMethod === "credit_card" && (
          <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
            <p className="text-sm text-gray-600">
              You will be redirected to a secure payment portal to complete your purchase after clicking "Place Order".
            </p>
          </div>
        )}
        
        <div className="flex items-center">
          <input
            type="radio"
            id="cash_on_delivery"
            name="paymentMethod"
            value="cash_on_delivery"
            checked={paymentMethod === "cash_on_delivery"}
            onChange={() => setPaymentMethod("cash_on_delivery")}
            className="mr-2"
          />
          <Label htmlFor="cash_on_delivery">Cash on Delivery</Label>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;