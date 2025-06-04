// src/pages/PaymentCompletePage.tsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { fetchOrderById } from "@/services/orderService";
const PaymentCompletePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    // Extract query parameters from URL
    const queryParams = new URLSearchParams(location.search);
    const orderRef = queryParams.get("order_id");
    const status = queryParams.get("status_code");
    
    // Function to verify payment and clear cart
    const verifyPaymentAndClearCart = async () => {
      try {
        // Basic validation
        if (!orderRef || status !== "2") {
          toast({
            title: "Payment Verification Failed",
            description: "We couldn't verify your payment. Please contact customer support.",
            variant: "destructive",
          });
          navigate("/cart");
          return;
        }

        // Get order details from your backend
        const orderData = await fetchOrderById(orderRef);
        
        if (!orderData) {
          toast({
            title: "Order Not Found",
            description: "We couldn't find your order. Please contact customer support.",
            variant: "destructive",
          });
          navigate("/cart");
          return;
        }

        // If order exists and payment is confirmed, clear cart
        clearCart();
        
        setOrderDetails(orderData);
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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-lg text-gray-600">
              Thank you for your order. Your payment has been processed successfully.
            </p>
          </div>

          {orderDetails && (
            <div className="border-t border-b border-gray-200 py-6 my-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Order Number:</span>
                  <span>{orderDetails.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Date:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Payment Method:</span>
                  <span>PayHere</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Total Amount:</span>
                  <span>LKR {orderDetails.amount?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="text-center space-y-4">
            <p>A confirmation email has been sent to your email address.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/")}
                className="bg-yooboba-gradient hover:opacity-90"
              >
                Continue Shopping
              </Button>
              <Button
                onClick={() => navigate("/my-orders")}
                variant="outline"
              >
                View My Orders
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentCompletePage;