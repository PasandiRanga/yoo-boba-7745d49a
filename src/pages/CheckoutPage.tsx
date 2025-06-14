// File: src/pages/CheckoutPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { createOrder, PaymentMethod } from "@/models/OrderModel";
import { createPendingOrder } from "@/services/orderService";
import { toast } from "@/components/ui/use-toast";
import { fetchCustomerById } from "@/services/customerService";
import { useAuth } from "@/context/authContext";

// Import styled components
import StyledInput from "@/components/ui/styledInput";
import StyledSelect from "@/components/ui/styledSelect";
import StyledTextarea from "@/components/ui/styledTextArea";
import { SelectItem } from "@/components/ui/select";

// Import our components
import PaymentForm from "@/components/checkout/PaymentForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import EmptyCart from "@/components/checkout/EmptyCart";

const CheckoutPage = () => {
  // Get selected items instead of all items
  const { getSelectedItems, selectedSubtotal, clearCart } = useCart();
  const selectedItems = getSelectedItems();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

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

  // Effect to load user data from auth context
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("Loading user data from auth context:", user);
      
      // Map user data from auth context to customer state
      setCustomer(prev => ({
        ...prev,
        firstName: (user as any).first_name || "",
        lastName: (user as any).last_name || "",
        email: user.emailaddress || "",
        phone: user.ContactNo || "",
        company: (user as any).company || "",
        userId: user.customerid || undefined,
      }));

      // Pre-fill address if available in user data
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
          {user && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Logged in as: <span className="font-medium text-gray-800 dark:text-gray-200">{user.FullName}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmitOrder}>
              {/* Customer Information */}
              <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Customer Information</h2>
                  {user && (
                    <span className="text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                      Auto-filled
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      First Name *
                    </label>
                    <StyledInput
                      type="text"
                      name="firstName"
                      id="firstName"
                      placeholder="Enter your first name"
                      value={customer.firstName}
                      onChange={handleCustomerChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Last Name *
                    </label>
                    <StyledInput
                      type="text"
                      name="lastName"
                      id="lastName"
                      placeholder="Enter your last name"
                      value={customer.lastName}
                      onChange={handleCustomerChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <StyledInput
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Enter your email address"
                      value={customer.email}
                      onChange={handleCustomerChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <StyledInput
                      type="tel"
                      name="phone"
                      id="phone"
                      placeholder="Enter your phone number"
                      value={customer.phone}
                      onChange={handleCustomerChange}
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company (Optional)
                    </label>
                    <StyledInput
                      type="text"
                      name="company"
                      id="company"
                      placeholder="Enter company name"
                      value={customer.company}
                      onChange={handleCustomerChange}
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Shipping Address</h2>
                  {user && user.Address && (
                    <span className="text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                      Auto-filled
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="shipping_street1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Street Address *
                    </label>
                    <StyledInput
                      type="text"
                      name="street1"
                      id="shipping_street1"
                      placeholder="Enter street address"
                      value={shippingAddress.street1}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="shipping_street2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Apartment, suite, etc. (Optional)
                    </label>
                    <StyledInput
                      type="text"
                      name="street2"
                      id="shipping_street2"
                      placeholder="Apartment, suite, etc."
                      value={shippingAddress.street2}
                      onChange={handleShippingChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="shipping_city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City *
                      </label>
                      <StyledInput
                        type="text"
                        name="city"
                        id="shipping_city"
                        placeholder="Enter city"
                        value={shippingAddress.city}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="shipping_state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        State/Province *
                      </label>
                      <StyledInput
                        type="text"
                        name="state"
                        id="shipping_state"
                        placeholder="Enter state/province"
                        value={shippingAddress.state}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="shipping_zipCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        ZIP/Postal Code *
                      </label>
                      <StyledInput
                        type="text"
                        name="zipCode"
                        id="shipping_zipCode"
                        placeholder="Enter ZIP/postal code"
                        value={shippingAddress.zipCode}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="shipping_country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Country *
                      </label>
                      <StyledSelect
                        name="country"
                        id="shipping_country"
                        placeholder="Select country"
                        value={shippingAddress.country}
                        onValueChange={handleShippingCountryChange}
                        required
                      >
                        <SelectItem value="Sri Lanka">Sri Lanka</SelectItem>
                        <SelectItem value="India">India</SelectItem>
                        <SelectItem value="Maldives">Maldives</SelectItem>
                        <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                        <SelectItem value="Pakistan">Pakistan</SelectItem>
                      </StyledSelect>
                    </div>
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Billing Address</h2>
                
                <div className="mb-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameAsBilling}
                      onChange={(e) => setSameAsBilling(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Same as shipping address
                    </span>
                  </label>
                </div>
                
                {!sameAsBilling && (
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label htmlFor="billing_street1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Street Address *
                      </label>
                      <StyledInput
                        type="text"
                        name="street1"
                        id="billing_street1"
                        placeholder="Enter street address"
                        value={billingAddress.street1}
                        onChange={handleBillingChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="billing_street2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Apartment, suite, etc. (Optional)
                      </label>
                      <StyledInput
                        type="text"
                        name="street2"
                        id="billing_street2"
                        placeholder="Apartment, suite, etc."
                        value={billingAddress.street2}
                        onChange={handleBillingChange}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="billing_city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          City *
                        </label>
                        <StyledInput
                          type="text"
                          name="city"
                          id="billing_city"
                          placeholder="Enter city"
                          value={billingAddress.city}
                          onChange={handleBillingChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="billing_state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          State/Province *
                        </label>
                        <StyledInput
                          type="text"
                          name="state"
                          id="billing_state"
                          placeholder="Enter state/province"
                          value={billingAddress.state}
                          onChange={handleBillingChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="billing_zipCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          ZIP/Postal Code *
                        </label>
                        <StyledInput
                          type="text"
                          name="zipCode"
                          id="billing_zipCode"
                          placeholder="Enter ZIP/postal code"
                          value={billingAddress.zipCode}
                          onChange={handleBillingChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="billing_country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Country *
                        </label>
                        <StyledSelect
                          name="country"
                          id="billing_country"
                          placeholder="Select country"
                          value={billingAddress.country}
                          onValueChange={handleBillingCountryChange}
                          required
                        >
                          <SelectItem value="Sri Lanka">Sri Lanka</SelectItem>
                          <SelectItem value="India">India</SelectItem>
                          <SelectItem value="Maldives">Maldives</SelectItem>
                          <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                          <SelectItem value="Pakistan">Pakistan</SelectItem>
                        </StyledSelect>
                      </div>
                    </div>
                  </div>
                )}
              </div>

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