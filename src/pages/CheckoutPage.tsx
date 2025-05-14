import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { createOrder, Customer, Address } from "@/models/OrderModel";
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
    country: "United States",
  });

  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [billingAddress, setBillingAddress] = useState({
    street1: "",
    street2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  // Payment information
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

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

  // Process the order
  const handleSubmitOrder = (e) => {
    e.preventDefault();
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
      // Simulate API call to create order
      const order = createOrder(
        customer,
        shippingAddress,
        sameAsBilling ? shippingAddress : billingAddress,
        orderItems,
        paymentMethod
      );

      // Simulate payment processing delay
      setTimeout(() => {
        // Clear the cart and show success message
        clearCart();
        toast({
          title: "Order Placed!",
          description: `Your order #${order.id} has been placed successfully.`,
        });
        navigate("/"); // Navigate to home page after successful order
        setLoading(false);
      }, 2000);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
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
              <CustomerInfoForm 
                customer={customer} 
                handleCustomerChange={handleCustomerChange} 
              />

              {/* Shipping Address */}
              <AddressForm 
                title="Shipping Address" 
                address={shippingAddress} 
                handleAddressChange={handleShippingChange} 
              />

              {/* Billing Address */}
              <BillingAddressForm 
                sameAsBilling={sameAsBilling} 
                setSameAsBilling={setSameAsBilling}
                billingAddress={billingAddress}
                handleBillingChange={handleBillingChange}
              />

              {/* Payment Information */}
              <PaymentForm 
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                cardNumber={cardNumber}
                setCardNumber={setCardNumber}
                cardExpiry={cardExpiry}
                setCardExpiry={setCardExpiry}
                cardCvc={cardCvc}
                setCardCvc={setCardCvc}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-yooboba-gradient hover:opacity-90"
                size="lg"
                disabled={loading}
              >
                {loading ? "Processing..." : "Place Order"}
              </Button>
            </form>
          </div>

          {/* Order Summary - using selected items */}
          <div className="lg:col-span-1">
            <OrderSummary items={selectedItems} subtotal={selectedSubtotal} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;