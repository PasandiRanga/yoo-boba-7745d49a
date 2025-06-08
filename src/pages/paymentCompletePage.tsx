// src/pages/PaymentCompletePage.tsx
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CheckCircle, Loader2, Heart, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingBobaPearls } from "@/components/ui/floatingBobaPearls";
import { toast } from "@/components/ui/use-toast";
import { fetchOrderById } from "@/services/orderService";
import { DatabaseOrderResponse, Order } from "@/types/order";
import { transformDatabaseOrder } from "@/utils/orderUtils";
import { generateReceipt } from "@/utils/receiptGenerator";
import { OrderSummary } from "@/components/order/OrderSummary";
import { CustomerInfo } from "@/components/order/CustomerInfo";
import { AddressInfo } from "@/components/order/AddressInfo";
import { OrderItems } from "@/components/order/OrderItems";

const PaymentCompletePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { removeOrderedItems } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [isGeneratingReceipt, setIsGeneratingReceipt] = useState(false);
  
  // Use ref to track if payment has been processed to prevent infinite loops
  const paymentProcessedRef = useRef(false);

  useEffect(() => {
    // Scroll to top when component loads
    window.scrollTo(0, 0);
    
    // Prevent running multiple times
    if (paymentProcessedRef.current) {
      return;
    }

    // Extract query parameters from URL
    const queryParams = new URLSearchParams(location.search);
    const orderRef = queryParams.get("order_id");

    console.log("Order Reference:", orderRef);
    
    // Function to verify payment and remove ordered items from cart
    const verifyPaymentAndUpdateCart = async () => {
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

        // Mark as processing to prevent re-runs
        paymentProcessedRef.current = true;

        // Get order details from your backend
        const fetchedOrderResponse = await fetchOrderById(orderRef);
        console.log("Raw Fetched Order Response:", fetchedOrderResponse);

        // Check if the response has the expected structure
        if (
          !fetchedOrderResponse ||
          typeof fetchedOrderResponse !== "object" ||
          !("order" in fetchedOrderResponse) ||
          !fetchedOrderResponse.order
        ) {
          toast({
            title: "Order Not Found",
            description: "We couldn't find your order. Please contact customer support.",
            variant: "destructive",
          });
          navigate("/cart");
          return;
        }

        // Ensure the response matches our expected type
        const orderResponse = fetchedOrderResponse as unknown as DatabaseOrderResponse;
        
        // Transform the database response to match our expected structure
        const transformedOrder = transformDatabaseOrder(orderResponse);
        console.log("Transformed Order:", transformedOrder);

        // If order exists and payment is confirmed, remove only ordered items from cart
        if (transformedOrder.items && transformedOrder.items.length > 0) {
          // Convert order items to CartItem format for removal
          const orderedItems = transformedOrder.items.map(orderItem => ({
            id: orderItem.productId,
            name: orderItem.name,
            price: orderItem.price,
            quantity: orderItem.quantity,
            image: "image" in orderItem && typeof orderItem.image === "string" ? orderItem.image : "",
            weight:
              "weight" in orderItem && typeof orderItem.weight === "string"
                ? orderItem.weight
                : undefined,
          }));
          
          await removeOrderedItems(orderedItems);
        }
        
        setOrderData(transformedOrder);
        toast({
          title: transformedOrder.paymentMethod === "cash_on_delivery" 
            ? "Order Confirmed" 
            : transformedOrder.paymentMethod === "bank_transfer"
            ? "Order Placed"
            : "Payment Successful",
          description: transformedOrder.paymentMethod === "cash_on_delivery" 
            ? `Your order #${orderRef} has been confirmed. You can pay upon delivery.`
            : transformedOrder.paymentMethod === "bank_transfer"
            ? `Your order #${orderRef} has been placed. Please complete the bank transfer.`
            : `Your order #${orderRef} has been confirmed and is being processed.`,
        });
        
      } catch (error) {
        console.error("Payment verification error:", error);
        toast({
          title: "Error Verifying Payment",
          description: "There was an error verifying your payment. Please contact customer support.",
          variant: "destructive",
        });
        navigate("/cart");
      } finally {
        setIsLoading(false);
      }
    };

    verifyPaymentAndUpdateCart();
  }, [location.search, navigate, removeOrderedItems]); // Include navigate and removeOrderedItems in dependencies

  // Handle a direct visit without payment parameters
  useEffect(() => {
    if (!location.search) {
      navigate("/");
    }
  }, [location.search, navigate]); // Only depend on search, not the entire location object

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen dark:bg-gray-900 dark:text-white">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-purple-200 dark:border-purple-700">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-purple-500" />
            <h1 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">Verifying Payment</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Please wait while we verify your payment...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const order = orderData;
  if (!order) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 relative">
        {/* Receipt container with FloatingBobaPearls */}
        <div className="max-w-4xl mx-auto relative" id="receipt">
          <FloatingBobaPearls />
          
          {/* Success Header */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6 border border-purple-200 dark:border-purple-700 relative overflow-hidden">
            <div className="text-center relative">
              <div className="relative inline-block">
                <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4 drop-shadow-lg" />
                <Heart className="h-6 w-6 text-pink-400 absolute -top-2 -right-2 animate-pulse" />
              </div>
              <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {order.paymentMethod === "cash_on_delivery" 
                  ? "Order Confirmed! 📦" 
                  : order.paymentMethod === "bank_transfer"
                  ? "Order Placed! 🏦"
                  : "Payment Successful! 🎉"
                }
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                {order.paymentMethod === "cash_on_delivery" 
                  ? "Thank you for your order! Your boba will be prepared and you can pay upon delivery 🚚" 
                  : order.paymentMethod === "bank_transfer"
                  ? "Thank you for your order! Please complete the bank transfer to process your boba adventure 💰"
                  : "Thank you for your order! Your boba adventure is being prepared with love 💕"
                }
              </p>
              {order.isGuestOrder && (
                <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 rounded-full px-4 py-2 border border-blue-200 dark:border-blue-700">
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    This order was placed as a guest. Consider creating an account to track your boba orders!
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OrderSummary order={order} />
            <CustomerInfo order={order} />
            {order.shippingAddress && <AddressInfo address={order.shippingAddress} type="shipping" />}
            {order.billingAddress && <AddressInfo address={order.billingAddress} type="billing" />}
            <OrderItems order={order} />
          </div>

          {/* Action Buttons */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mt-6 border border-purple-200 dark:border-purple-700 relative overflow-hidden">
            <div className="text-center space-y-6">
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                A confirmation email has been sent to your inbox! Check it out for all the sweet details 📧✨
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate("/")}
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-purple-300 dark:border-purple-600"
                >
                  Continue Shopping 🛍️
                </Button>
                <Button
                  onClick={() => generateReceipt(order, setIsGeneratingReceipt)}
                  disabled={isGeneratingReceipt}
                  variant="outline"
                  className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-400 dark:hover:bg-purple-900/20 dark:bg-gray-800 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  {isGeneratingReceipt ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="h-5 w-5 mr-2" />
                      Download Receipt
                    </>
                  )}
                </Button>
                {!order.isGuestOrder && (
                  <Button
                    onClick={() => navigate("/my-orders")}
                    variant="outline"
                    className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-400 dark:hover:bg-purple-900/20 dark:bg-gray-800 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    View My Orders 📋
                  </Button>
                )}
                {order.isGuestOrder && (
                  <Button
                    onClick={() => navigate("/signUp")}
                    variant="outline"
                    className="border-2 border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20 dark:bg-gray-800 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    Create Account 🌟
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