import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { createPendingOrder } from "@/services/orderService";
import { processPayment } from "@/services/paymentService";
import { useAuth } from "@/context/AuthContext";

const PaymentPortalPage = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // Add a ref to track if payment has been initiated
  const hasInitiatedPayment = useRef(false);
  
  useEffect(() => {
    // Extract data from location state
    const orderData = location.state || {};
    
    // Validate if we have necessary order data
    if (!orderData.orderId || !orderData.amount) {
      toast({
        title: "Error",
        description: "Invalid order information. Please try again.",
        variant: "destructive",
      });
      navigate("/cart");
      return;
    }

    // Only process payment if it hasn't been initiated yet
    if (!hasInitiatedPayment.current) {
      // Set the ref to true to prevent duplicate processing
      hasInitiatedPayment.current = true;
      
      const handlePaymentProcess = async () => {
        console.log("Processing payment for order:", orderData);
        try {
          setIsLoading(true);
          
          // Step 1: Create the pending order in the database
          await createPendingOrder({
            orderId: orderData.orderId,
            customer: orderData.customer,
            shippingAddress: orderData.shippingAddress,
            billingAddress: orderData.billingAddress,
            items: orderData.items,
            amount: orderData.amount,
            paymentMethod: "payhere",
            status: "pending"
          });
          
          // Step 2: Process payment through payment service
          await processPayment(orderData.orderId);
          
        } catch (error) {
          console.error("Payment process error:", error);
          setError(error instanceof Error ? error.message : "An unknown error occurred");
          
          toast({
            title: "Payment Error",
            description: error instanceof Error ? error.message : "Failed to process payment. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };

      handlePaymentProcess();
    }
  }, [location.state, navigate]);

  // If there's an error, show it
  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h1 className="text-2xl font-semibold mb-2">Payment Error</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error}
            </p>
            <button 
              onClick={() => navigate("/checkout")}
              className="px-6 py-2 bg-yooboba-purple text-white rounded-md hover:bg-purple-700"
            >
              Return to Checkout
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-yooboba-purple" />
          <h1 className="text-2xl font-semibold mb-2">Redirecting to Payment Gateway</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we redirect you to the secure payment portal...
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentPortalPage;