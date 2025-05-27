// src/pages/PaymentCompletePage.tsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CheckCircle, Loader2, User, MapPin, Package, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { fetchOrderById } from "@/services/orderService";
import { Order } from "@/models/OrderModel";

// Add interface for the database response structure
interface DatabaseOrderResponse {
  order: {
    id: string;
    customer: {
      id: number;
      order_id: string;
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      company?: string;
      user_id?: string;
    };
    shippingAddress: {
      id: number;
      order_id: string;
      address_type: string;
      street1: string;
      street2?: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    billingAddress: {
      id: number;
      order_id: string;
      address_type: string;
      street1: string;
      street2?: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    items: Array<{
      id: number;
      order_id: string;
      product_id: string;
      name: string;
      price: string;
      quantity: number;
    }>;
    total_amount: string;
    status: string;
    payment_method: string;
    payment_status: string;
    payment_id?: string;
    created_at: string;
    updated_at: string;
    is_guest_order: boolean;
  };
}

// Helper function to transform database response to expected Order structure
const transformDatabaseOrder = (dbResponse: DatabaseOrderResponse): Order => {
  const dbOrder = dbResponse.order;
  
  return {
    id: dbOrder.id,
    customer: {
      firstName: dbOrder.customer.first_name,
      lastName: dbOrder.customer.last_name,
      email: dbOrder.customer.email,
      phone: dbOrder.customer.phone,
      company: dbOrder.customer.company,
      userId: dbOrder.customer.user_id,
    },
    shippingAddress: {
      street1: dbOrder.shippingAddress.street1,
      street2: dbOrder.shippingAddress.street2,
      city: dbOrder.shippingAddress.city,
      state: dbOrder.shippingAddress.state,
      zipCode: dbOrder.shippingAddress.zipCode,
      country: dbOrder.shippingAddress.country,
    },
    billingAddress: {
      street1: dbOrder.billingAddress.street1,
      street2: dbOrder.billingAddress.street2,
      city: dbOrder.billingAddress.city,
      state: dbOrder.billingAddress.state,
      zipCode: dbOrder.billingAddress.zipCode,
      country: dbOrder.billingAddress.country,
    },
    items: dbOrder.items.map(item => ({
      productId: item.product_id,
      name: item.name,
      price: parseFloat(item.price),
      quantity: item.quantity,
    })),
    total: parseFloat(dbOrder.total_amount),
    status: dbOrder.status as Order["status"],
    paymentMethod: dbOrder.payment_method as Order["paymentMethod"],
    paymentStatus: dbOrder.payment_status as Order["paymentStatus"],
    paymentId: dbOrder.payment_id,
    createdAt: new Date(dbOrder.created_at),
    updatedAt: new Date(dbOrder.updated_at),
    isGuestOrder: dbOrder.is_guest_order,
  };
};

const PaymentCompletePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [orderData, setOrderData] = useState<Order | null>(null);

  useEffect(() => {
    // Extract query parameters from URL
    const queryParams = new URLSearchParams(location.search);
    const orderRef = queryParams.get("order_id");

    console.log("Order Reference:", orderRef);
    
    // Function to verify payment and clear cart
    const verifyPaymentAndClearCart = async () => {
      try {
        if (!orderRef) {
          toast({
            title: "Missing Order ID",
            description: "We couldn't verify your payment because the order reference is missing.",
            variant: "destructive",
          });
          navigate("/cart");
          return;
        }

        // Get order details from your backend
        const fetchedOrderResponse = await fetchOrderById(orderRef);
        console.log("Raw Fetched Order Response:", fetchedOrderResponse);

        // Check if the response has the expected 'order' property
        if (
          !fetchedOrderResponse ||
          typeof fetchedOrderResponse !== "object" ||
          !("order" in fetchedOrderResponse)
        ) {
          toast({
            title: "Order Not Found",
            description: "We couldn't find your order. Please contact customer support.",
            variant: "destructive",
          });
          navigate("/cart");
          return;
        }

        // Transform the database response to match our expected structure
        const transformedOrder = transformDatabaseOrder(fetchedOrderResponse as DatabaseOrderResponse);
        console.log("Transformed Order:", transformedOrder);

        // If order exists and payment is confirmed, clear cart
        clearCart();
        
        setOrderData(transformedOrder);
        toast({
          title: "Payment Successful",
          description: `Your order #${orderRef} has been confirmed and is being processed.`,
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error("Payment verification error:", error);
        toast({
          title: "Error Verifying Payment",
          description: "There was an error verifying your payment. Please contact customer support.",
          variant: "destructive",
        });
        navigate("/cart");
      }
    };

    verifyPaymentAndClearCart();
  }, [location, navigate, clearCart]);

  // Handle a direct visit without payment parameters
  useEffect(() => {
    if (!location.search) {
      navigate("/");
    }
  }, [location, navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-yooboba-purple" />
            <h1 className="text-2xl font-semibold mb-2">Verifying Payment</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we verify your payment...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const order = orderData;
  console.log("Final Order Data:", order);
  const isGuestOrder = order?.isGuestOrder;
  console.log("Is Guest Order:", isGuestOrder);
  const customer = order?.customer;
  console.log("Customer Data:", customer);

  // Helper function to get customer name
  const getCustomerName = () => {
    if (!customer) return "N/A";
    return `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 
           (isGuestOrder ? "Guest User" : "Registered User");
  };

  // Helper function to get customer email
  const getCustomerEmail = () => {
    if (!customer) return "N/A";
    return customer.email || "N/A";
  };

  // Helper function to get customer phone
  const getCustomerPhone = () => {
    if (!customer) return "N/A";
    return customer.phone || "N/A";
  };

  // Define Address type based on your OrderModel (adjust fields if needed)
  type Address = {
    street1?: string;
    street2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };

  // Helper function to format address
  const formatAddress = (address: Address | undefined | null) => {
    if (!address) return "N/A";
    const parts = [
      address.street1,
      address.street2,
      address.city,
      address.state,
      address.zipCode,
      address.country
    ].filter(Boolean);
    return parts.join(", ");
  };

  // Helper function to capitalize first letter
  const capitalize = (str: string | undefined) => {
    if (!str) return "N/A";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                Payment Successful!
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Thank you for your order. Your payment has been processed successfully.
              </p>
              {isGuestOrder && (
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                  This order was placed as a guest. Consider creating an account to track your orders easily.
                </p>
              )}
            </div>
          </div>

          {order && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Summary */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Package className="h-5 w-5 text-blue-500 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Order Summary
                  </h2>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Order Number:</span>
                    <span className="text-gray-900 dark:text-white">{order.id}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Date:</span>
                    <span className="text-gray-900 dark:text-white">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Status:</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 rounded-full text-sm">
                      {capitalize(order.status)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Payment Method:</span>
                    <span className="text-gray-900 dark:text-white">
                      {order.paymentMethod ? order.paymentMethod.replace('_', ' ').toUpperCase() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Payment Status:</span>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      order.paymentStatus === 'paid'
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        : order.paymentStatus === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                        : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                    }`}>
                      {capitalize(order.paymentStatus)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Total Amount:</span>
                    <span className="text-xl font-bold text-green-600 dark:text-green-400">
                      LKR {order.total?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <User className="h-5 w-5 text-blue-500 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Customer Information
                  </h2>
                  {isGuestOrder && (
                    <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100 rounded-full text-xs">
                      Guest
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Name:</span>
                    <span className="text-gray-900 dark:text-white">{getCustomerName()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Email:</span>
                    <span className="text-gray-900 dark:text-white">{getCustomerEmail()}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Phone:</span>
                    <span className="text-gray-900 dark:text-white">{getCustomerPhone()}</span>
                  </div>
                  {customer?.company && (
                    <div className="flex justify-between py-2 border-t border-gray-200 dark:border-gray-600">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Company:</span>
                      <span className="text-gray-900 dark:text-white">{customer.company}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              {order.shippingAddress && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <MapPin className="h-5 w-5 text-blue-500 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Shipping Address
                    </h2>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {formatAddress(order.shippingAddress)}
                  </p>
                </div>
              )}

              {/* Billing Address */}
              {order.billingAddress && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <MapPin className="h-5 w-5 text-blue-500 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Billing Address
                    </h2>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {formatAddress(order.billingAddress)}
                  </p>
                </div>
              )}

              {/* Order Items */}
              {order.items && order.items.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 lg:col-span-2">
                  <div className="flex items-center mb-4">
                    <CreditCard className="h-5 w-5 text-blue-500 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Order Items
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                         
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900 dark:text-white">
                            LKR {(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            LKR {item.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-6">
            <div className="text-center space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                A confirmation email has been sent to your email address.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate("/")}
                  className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-6 py-2"
                >
                  Continue Shopping
                </Button>
                {!isGuestOrder && (
                  <Button
                    onClick={() => navigate("/my-orders")}
                    variant="outline"
                    className="border-purple-300 text-purple-600 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-400 dark:hover:bg-purple-900/20"
                  >
                    View My Orders
                  </Button>
                )}
                {isGuestOrder && (
                  <Button
                    onClick={() => navigate("/signUp")}
                    variant="outline"
                    className="border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20"
                  >
                    Create Account
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentCompletePage;