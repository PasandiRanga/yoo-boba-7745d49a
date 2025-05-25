// File: src/pages/CheckoutPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { createOrder, PaymentMethod } from "@/models/OrderModel";
import { toast } from "@/components/ui/use-toast";
import { fetchCustomerById } from "@/services/customerService";

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
  const [loggedInUser, setLoggedInUser] = useState(null);

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

  // Effect to load user data from session storage
  // Effect to load user data from session storage
// Effect to load user data from session storage
useEffect(() => {
  const loadUserData = async () => {
    const storedUser = sessionStorage.getItem("customer");
    console.log("Stored user data:", storedUser);
    
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        console.log("Stored user id", userData.customerid);

        // Properly await the async function
        const fetchedUserData = await fetchCustomerById(userData.customerid);
        console.log("Fetched user data:", fetchedUserData);
        
        // Map fetched user data to Order model Customer interface
        setCustomer(prev => ({
          ...prev,
          firstName: fetchedUserData.first_name || "",
          lastName: fetchedUserData.last_name || "",
          email: fetchedUserData.emailaddress || "",
          phone: fetchedUserData.contactno || "",
          company: fetchedUserData.company || "",
          userId: fetchedUserData.customerid || undefined,
        }));

        // Pre-fill address if available in user data
        // Address is a string in the fetched data
        if (fetchedUserData.address && typeof fetchedUserData.address === 'string') {
          const userAddress = {
            street1: fetchedUserData.address,
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
      } catch (error) {
        console.error("Error parsing user data from session or fetching from API:", error);
        // Clear invalid session data
        sessionStorage.removeItem("customer");
      }
    }
  };

  // Call the async function
  loadUserData();
}, [sameAsBilling]);

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
  const handleSubmitOrder = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      // Convert selected cart items to order items
      const orderItems = selectedItems.map((item) => ({
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
            paymentMethod: "bank_transfer",
            orderDetails: order
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
            paymentMethod: "cash_on_delivery",
            orderDetails: order
          } 
        });
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
          {loggedInUser && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Logged in as: <span className="font-medium text-gray-800 dark:text-gray-200">{loggedInUser.first_name} {loggedInUser.last_name}</span>
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
                  {loggedInUser && (
                    <span className="text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                      Auto-filled
                    </span>
                  )}
                </div>
                <CustomerInfoForm 
                  customer={customer} 
                  handleCustomerChange={handleCustomerChange} 
                />
              </div>

              {/* Shipping Address */}
              <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Shipping Address</h2>
                  {loggedInUser && loggedInUser.address && (
                    <span className="text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                      Auto-filled
                    </span>
                  )}
                </div>
                <AddressForm 
                  title=""
                  address={shippingAddress} 
                  handleAddressChange={handleShippingChange} 
                />
              </div>

              {/* Billing Address */}
              <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <BillingAddressForm 
                  sameAsBilling={sameAsBilling} 
                  setSameAsBilling={setSameAsBilling}
                  billingAddress={billingAddress}
                  handleBillingChange={handleBillingChange}
                />
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