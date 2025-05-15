import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { initializePayment } from "@/services/paymentService";

const PaymentPortal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Extract data from location state
  const { orderId, amount, customer, shippingAddress, billingAddress, items } = location.state || {};
  
  // Check if we're receiving a callback from PayHere
  useEffect(() => {
    // Check for PayHere callback parameters in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('status_code');
    
    // If we have payment status, it means we're receiving a callback from PayHere
    if (paymentStatus) {
      const paymentData = {
        merchant_id: urlParams.get('merchant_id'),
        order_id: urlParams.get('order_id'),
        payment_id: urlParams.get('payment_id'),
        payhere_amount: urlParams.get('payhere_amount'),
        payhere_currency: urlParams.get('payhere_currency'),
        status_code: paymentStatus,
        method: urlParams.get('method'),
        status_message: urlParams.get('status_message'),
        customer: customer || {},
        items: items || [],
        shipping_address: shippingAddress || {},
        timestamp: new Date().toISOString()
      };

      // Redirect to the receipt page with payment data
      navigate('/receipt', { state: paymentData });
      return;
    }
    
    // Continue with normal flow if not a callback
    // Validate if we have the necessary data
    if (!orderId || !amount) {
      setError("Missing order information. Please try again.");
      setLoading(false);
      return;
    }
    
    // Process payment with our payment service
    const processPayment = async () => {
      try {
        // Get payment data from our server using the paymentService
        const response = await initializePayment({
          orderId,
          amount,
          customer: customer || {},
          shippingAddress: shippingAddress || {},
          billingAddress: billingAddress || {},
          items: items || []
        });

        if (response.success) {
          // Create form and submit to PayHere
          submitToPayHere(response.paymentData);
        } else {
          setError("Failed to initialize payment. Please try again.");
          setLoading(false);
        }
      } catch (err) {
        console.error("Payment initialization error:", err);
        setError("An error occurred while connecting to the payment gateway. Please try again.");
        setLoading(false);
      }
    };
    
    processPayment();
  }, [orderId, amount, customer, shippingAddress, billingAddress, items, navigate]);
  
  // Function to submit form to PayHere
  const submitToPayHere = (paymentData) => {
    // Create a form element
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://sandbox.payhere.lk/pay/authorize"; // Use https://www.payhere.lk/pay/checkout for production
    
    // Add all payment data as hidden fields
    Object.entries(paymentData).forEach(([key, value]) => {
      const hiddenField = document.createElement("input");
      hiddenField.type = "hidden";
      hiddenField.name = key;
      hiddenField.value = value.toString();
      form.appendChild(hiddenField);
    });
    
    // Append to body and submit
    document.body.appendChild(form);
    form.submit();
  };
  
  // If there's an error, show it and provide a way back
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <h1 className="text-2xl font-semibold text-red-600 mb-4">Payment Error</h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => navigate("/checkout")}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Return to Checkout
          </button>
        </div>
      </div>
    );
  }
  
  // Show loading state while preparing payment
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Connecting to Payment Gateway
        </h1>
        <div className="flex justify-center mb-6">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        </div>
        <p className="text-center text-gray-600">
          Please wait while we redirect you to our secure payment partner.
        </p>
      </div>
    </div>
  );
};

export default PaymentPortal;