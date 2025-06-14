// File: src/pages/CheckoutPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/authContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { createOrder, PaymentMethod } from "@/models/OrderModel";
import { createPendingOrder } from "@/services/orderService";
import { toast } from "@/hooks/use-toast";

// Import our components
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import EmptyCart from "@/components/checkout/EmptyCart";

const CheckoutPage = () => {
  // Get selected items instead of all items
  const { getSelectedItems, selectedSubtotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const selectedItems = getSelectedItems();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Customer Information - Initialize with empty values
  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    userId: undefined,
  });

  // Address information
  const [shippingAddress, setShippingAddress] = useState({
    street1: "",
    street2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Sri Lanka",
  });

  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [billingAddress, setBillingAddress] = useState({
    street1: "",
    street2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Sri Lanka",
  });

  // Payment information
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("payhere"); // Default to PayHere

  // Effect to prefill data for authenticated users
  useEffect(() => {
    if (isAuthenticated && user) {
      // Map user data from auth context to customer fields
      setCustomer(prev => ({
        ...prev,
        firstName: user.FullName?.split(' ')[0] || "",
        lastName: user.FullName?.split(' ').slice(1).join(' ') || "",
        email: user.emailaddress || "",
        phone: user.ContactNo || "",
        company: "",
        userId: user.customerid || undefined,
      }));

      // Pre-fill address if available
      if (user.Address && typeof user.Address === 'string') {
        const userAddress = {
          street1: user.Address,
          street2: "",
          city: "",
          state: "",
          zipCode: "",
          country: "Sri Lanka",
        };
        
        setShippingAddress(userAddress);
        if (sameAsBilling) {
          setBillingAddress(userAddress);
        }
      }
    }
  }, [isAuthenticated, user, sameAsBilling]);

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

  // Handle country change for shipping address
  const handleShippingCountryChange = (value: string) => {
    setShippingAddress((prev) => ({ ...prev, country: value }));
    if (sameAsBilling) {
      setBillingAddress((prev) => ({ ...prev, country: value }));
    }
  };

  // Handle country change for billing address
  const handleBillingCountryChange = (value: string) => {
    setBillingAddress((prev) => ({ ...prev, country: value }));
  };

  // Validate the form
  const validateForm = () => {
    // Check if cart is empty
    if (selectedItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Add items before checkout.",
        variant: "destructive",
      });
      return false;
    }
    
    // Check customer details
    if (!customer.firstName || !customer.lastName || !customer.email || !customer.phone) {
      toast({
        title: "Missing Information",
        description: "Please provide all required customer information.",
        variant: "destructive",
      });
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email)) {
      toast({
        title: "Invalid Email",
        description: "Please provide a valid email address.",
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
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      // Convert selected cart items to order items
      const orderItems = selectedItems.map((item, index) => ({
        id: index + 1, // Add required id property
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      // Calculate totals
      const subtotal = selectedSubtotal;
      const shipping = 350.00;
      const tax = subtotal * 0.08; // 8% tax
      const orderTotal = subtotal + shipping + tax;
  
      // Create a new order with updated customer data
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
            customer: order.customer,
            shippingAddress: order.shippingAddress,
            billingAddress: order.billingAddress,
            items: order.items,
            amount: orderTotal, // Using calculated total with tax and shipping
            customerEmail: customer.email
          } 
        });
      } else {
        // For Cash on Delivery and Bank Transfer, create order in database
        const pendingOrderData = {
          orderId: order.id,
          customer: {
            ...customer,
            customerid: customer.userId // Map userId to customerid for backend
          },
          shippingAddress,
          billingAddress: sameAsBilling ? shippingAddress : billingAddress,
          items: orderItems,
          amount: orderTotal,
          paymentMethod,
          status: 'pending' as const
        };

        // Create order in database
        const createdOrder = await createPendingOrder(pendingOrderData);
        
        clearCart();
        toast({
          title: "Order Placed!",
          description: paymentMethod === "bank_transfer" 
            ? `Your order #${order.id} has been placed. Please complete the bank transfer to finalize your order.`
            : `Your order #${order.id} has been placed successfully.`,
        });
        
        // Navigate to payment complete page with order ID
        navigate(`/payment-complete?order_id=${order.id}`);
      }
    } catch (error) {
      console.error("Checkout error:", error);
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold font-display">Checkout</h1>
          {/* Show logged in user info */}
          {isAuthenticated && user && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Logged in as: <span className="font-medium text-gray-800 dark:text-gray-200">{user.FullName}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <CheckoutForm
            customer={customer}
            shippingAddress={shippingAddress}
            billingAddress={billingAddress}
            sameAsBilling={sameAsBilling}
            paymentMethod={paymentMethod}
            selectedItems={selectedItems}
            selectedSubtotal={selectedSubtotal}
            loading={loading}
            isAuthenticated={isAuthenticated}
            user={user}
            handleCustomerChange={handleCustomerChange}
            handleShippingChange={handleShippingChange}
            handleBillingChange={handleBillingChange}
            handleShippingCountryChange={handleShippingCountryChange}
            handleBillingCountryChange={handleBillingCountryChange}
            setSameAsBilling={setSameAsBilling}
            setPaymentMethod={setPaymentMethod}
            onSubmit={handleSubmitOrder}
          />

          {/* Order Summary for Desktop Only */}
          <div className="lg:col-span-1 hidden lg:block">
            <OrderSummary 
              items={selectedItems} 
              subtotal={selectedSubtotal}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;