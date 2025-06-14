import React from 'react';
import { Button } from "@/components/ui/button";
import { PaymentMethod } from "@/models/OrderModel";
import CustomerInfoForm from "./CustomerInfoForm";
import ShippingAddressForm from "./ShippingAddressForm";
import BillingAddressForm from "./BillingAddressForm";
import PaymentForm from "./PaymentForm";
import OrderSummary from "./OrderSummary";

interface Address {
  street1: string;
  street2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  userId?: string;
}

interface CheckoutFormProps {
  customer: Customer;
  shippingAddress: Address;
  billingAddress: Address;
  sameAsBilling: boolean;
  paymentMethod: PaymentMethod;
  selectedItems: any[];
  selectedSubtotal: number;
  loading: boolean;
  isAuthenticated: boolean;
  user: any;
  handleCustomerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleShippingChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBillingChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleShippingCountryChange: (value: string) => void;
  handleBillingCountryChange: (value: string) => void;
  setSameAsBilling: (value: boolean) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  customer,
  shippingAddress,
  billingAddress,
  sameAsBilling,
  paymentMethod,
  selectedItems,
  selectedSubtotal,
  loading,
  isAuthenticated,
  user,
  handleCustomerChange,
  handleShippingChange,
  handleBillingChange,
  handleShippingCountryChange,
  handleBillingCountryChange,
  setSameAsBilling,
  setPaymentMethod,
  onSubmit
}) => {
  return (
    <div className="lg:col-span-2">
      <form onSubmit={onSubmit}>
        {/* Customer Information */}
        <CustomerInfoForm
          customer={customer}
          handleCustomerChange={handleCustomerChange}
          isAuthenticated={isAuthenticated}
          user={user}
        />

        {/* Shipping Address */}
        <ShippingAddressForm
          shippingAddress={shippingAddress}
          handleShippingChange={handleShippingChange}
          handleShippingCountryChange={handleShippingCountryChange}
          isAuthenticated={isAuthenticated}
          user={user}
        />

        {/* Billing Address */}
        <BillingAddressForm
          billingAddress={billingAddress}
          sameAsBilling={sameAsBilling}
          setSameAsBilling={setSameAsBilling}
          handleBillingChange={handleBillingChange}
          handleBillingCountryChange={handleBillingCountryChange}
        />

        {/* Payment Information */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <PaymentForm 
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
        </div>

        {/* Order Summary for Mobile Only */}
        <div className="mb-8 lg:hidden">
          <OrderSummary 
            items={selectedItems} 
            subtotal={selectedSubtotal}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-yooboba-gradient hover:opacity-90"
          size="lg"
          disabled={loading}
        >
          {loading ? "Processing..." : 
            paymentMethod === "payhere" ? "Proceed to Payment" : 
            paymentMethod === "bank_transfer" ? "Place Order & Pay via Bank Transfer" :
            "Place Order (Pay on Delivery)"}
        </Button>
      </form>
    </div>
  );
};

export default CheckoutForm;