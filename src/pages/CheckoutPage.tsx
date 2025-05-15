// File: src/pages/CheckoutPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { createOrder } from "@/models/OrderModel";
import { toast } from "@/components/ui/use-toast";

// Import our components
import CustomerInfoForm from "@/components/checkout/CustomerInfoForm";
import AddressForm from "@/components/checkout/AddressForm";
import PaymentForm from "@/components/checkout/PaymentForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import EmptyCart from "@/components/checkout/EmptyCart";
import BillingAddressForm from "@/components/checkout/BillingAddressForm";

const CheckoutPage = () => {
  // Get selected items instead of all items
  const { getSelectedItems, selectedSubtotal, clearCart } = useCart();
  const selectedItems = getSelectedItems();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Shipping information
  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
  });

  // Address information
  const [shippingAddress, setShippingAddress] = useState({
    street1: "",
    street2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Sri Lanka", // Changed default to Sri Lanka
  });

  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [billingAddress, setBillingAddress] = useState({
    street1: "",
    street2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Sri Lanka", // Changed default to Sri Lanka
  });

  // Payment information
  const [paymentMethod, setPaymentMethod] = useState("payhere"); // Default to PayHere

  // Handle input changes for customer info
  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  // Handle input changes for shipping address
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
    if (sameAsBilling) {
      setBillingAddress((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle input changes for billing address
  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Validate the form
  const validateForm = () => {
    // Check customer details
    if (!customer.firstName || !customer.lastName || !customer.email || !customer.phone) {
      toast({
        title: "Missing Information",
        description: "Please provide all required customer information.",
        variant: "destructive",
      });
      return false;
    }

    // Check shipping address
    if (!shippingAddress.street1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      toast({
        title: "Missing Information",
        description: "Please provide a complete shipping address.",
        variant: "destructive",
      });
      return false;
    }

    // Check billing address if different from shipping
    if (!sameAsBilling && (!billingAddress.street1 || !billingAddress.city || !billingAddress.state || !billingAddress.zipCode)) {
      toast({
        title: "Missing Information",
        description: "Please provide a complete billing address.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  // Process the order
  const handleSubmitOrder = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    // Convert selected cart items to order items
    const orderItems = selectedItems.map((item) => ({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    // Create a new order
    try {
      // Create order
      const order = createOrder(
        customer,
        shippingAddress,
        sameAsBilling ? shippingAddress : billingAddress,
        orderItems,
        paymentMethod
      );

      if (paymentMethod === "payhere") {
        // Redirect to payment portal with order details
        toast({
          title: "Redirecting to Payment Portal",
          description: "Please complete your payment to finalize your order.",
        });
        
        // Redirect to payment portal
        navigate("/payment-portal", { 
          state: { 
            orderId: order.id,
            amount: selectedSubtotal,
            customerEmail: customer.email,
            customer: customer,
            shippingAddress: shippingAddress,
            billingAddress: sameAsBilling ? shippingAddress : billingAddress,
            items: orderItems
          } 
        });
      } else if (paymentMethod === "bank_transfer") {
        // Handle bank transfer
        clearCart();
        toast({
          title: "Order Placed!",
          description: `Your order #${order.id} has been placed. Please complete the bank transfer to finalize your order.`,
        });
        navigate("/order-confirmation", { 
          state: { 
            orderId: order.id,
            paymentMethod: "bank_transfer" 
          } 
        });
      } else {
        // For Cash on Delivery, complete the order directly
        clearCart();
        toast({
          title: "Order Placed!",
          description: `Your order #${order.id} has been placed successfully.`,
        });
        navigate("/order-confirmation", { 
          state: { 
            orderId: order.id,
            paymentMethod: "cash_on_delivery" 
          } 
        });
      }
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Redirect to cart if there are no selected items
  if (selectedItems.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <EmptyCart />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold font-display mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmitOrder}>
              {/* Customer Information */}
              <div className="mb-8 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
                <CustomerInfoForm 
                  customer={customer} 
                  handleCustomerChange={handleCustomerChange} 
                />
              </div>

              {/* Shipping Address */}
              <div className="mb-8 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <AddressForm 
                  title="Shipping Address"
                  address={shippingAddress} 
                  handleAddressChange={handleShippingChange} 
                />
              </div>

              {/* Billing Address */}
              <div className="mb-8 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <BillingAddressForm 
                  sameAsBilling={sameAsBilling} 
                  setSameAsBilling={setSameAsBilling}
                  billingAddress={billingAddress}
                  handleBillingChange={handleBillingChange}
                />
              </div>

              {/* Payment Information */}
              <div className="mb-8 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <PaymentForm 
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                />
              </div>

              {/* Order Summary for Mobile Only */}
              <div className="mb-8 lg:hidden">
                <OrderSummary items={selectedItems} subtotal={selectedSubtotal} />
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

          {/* Order Summary for Desktop Only */}
          <div className="lg:col-span-1 hidden lg:block">
            <OrderSummary items={selectedItems} subtotal={selectedSubtotal} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;