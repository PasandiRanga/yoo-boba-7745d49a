import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { toast } from "@/components/ui/use-toast";

const PaymentPortal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    orderId: "",
    amount: 0,
    customerEmail: ""
  });

  useEffect(() => {
    // Get order details from location state
    if (location.state?.orderId && location.state?.amount) {
      setOrderDetails({
        orderId: location.state.orderId,
        amount: location.state.amount,
        customerEmail: location.state.customerEmail || ""
      });
    } else {
      // If no order details found, check session storage
      const pendingOrderId = sessionStorage.getItem("pendingOrderId");
      if (!pendingOrderId) {
        // No order found, redirect to checkout
        toast({
          title: "No Active Order",
          description: "No active payment session found. Please try again.",
          variant: "destructive",
        });
        navigate("/checkout");
      }
    }
  }, [location, navigate]);

  const handleCompletePayment = () => {
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Clear pending order from session storage
      sessionStorage.removeItem("pendingOrderId");
      
      toast({
        title: "Payment Successful",
        description: `Your payment for order #${orderDetails.orderId} has been processed successfully.`,
      });
      
      // Navigate to order confirmation page
      navigate("/order-confirmation", { 
        state: { 
          orderId: orderDetails.orderId,
          paymentComplete: true
        } 
      });
    }, 2000);
  };

  const handleCancelPayment = () => {
    toast({
      title: "Payment Cancelled",
      description: "Your payment has been cancelled. Your order is saved but not confirmed.",
    });
    navigate("/checkout");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 border border-gray-200">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Secure Payment Portal</h1>
            <p className="text-gray-600 mt-2">Complete your purchase securely</p>
          </div>
          
          <div className="border-t border-b border-gray-200 py-4 my-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium">{orderDetails.orderId}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">${orderDetails.amount?.toFixed(2)}</span>
            </div>
            {orderDetails.customerEmail && (
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{orderDetails.customerEmail}</span>
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <p className="text-sm text-gray-600">
              This is a demonstration payment portal. In a real application, this would integrate with a payment processor like Stripe, PayPal, or other secure payment systems.
            </p>
          </div>
          
          <div className="space-y-4">
            <Button
              onClick={handleCompletePayment}
              className="w-full bg-yooboba-gradient hover:opacity-90"
              size="lg"
              disabled={loading}
            >
              {loading ? "Processing Payment..." : "Complete Payment"}
            </Button>
            
            <Button
              onClick={handleCancelPayment}
              variant="outline"
              className="w-full"
              disabled={loading}
            >
              Cancel Payment
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentPortal;