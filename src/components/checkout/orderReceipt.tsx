import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Download, Check, ArrowLeft } from "lucide-react";
import ScrollAnimation from "@/components/animations/ScrollAnimations";
import FloatingBubbles from "@/components/animations/floatingBubbles";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const OrderReceipt = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const receiptRef = useRef(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  // Extract payment response data from location state
  const { 
    merchant_id, 
    order_id, 
    payment_id,
    payhere_amount,
    payhere_currency,
    status_code,
    method,
    status_message,
    customer,
    items,
    shipping_address,
    timestamp
  } = location.state || {};
  
  // Calculate order summary
  const subtotal = items?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;
  const shipping = 5.00; // Example shipping cost
  const tax = subtotal * 0.12; // Example tax rate (12%)
  const total = subtotal + shipping + tax;
  
  // Format date from timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Handle PDF download
  const handleDownloadReceipt = async () => {
    if (!receiptRef.current) return;
    
    setIsGeneratingPDF(true);
    
    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; 
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`YooBoba_Order_${order_id}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  
  // If no order data is available, show an error and redirect option
  if (!order_id || status_code !== "2") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-md w-full">
          <h1 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-4">Receipt Not Available</h1>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            We couldn't find your order information or the payment was not successful.
          </p>
          <Button 
            onClick={() => navigate("/")}
            className="w-full bg-yooboba-gradient hover:opacity-90 text-white font-semibold"
          >
            Return to Home
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300 min-h-screen">
      {/* Background decorative elements */}
      <div className="hidden lg:block lg:absolute lg:inset-0">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-yooboba-light dark:bg-yooboba-blue rounded-bl-[100px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-yooboba-light dark:bg-yooboba-blue rounded-tr-[100px] opacity-20"></div>
      </div>

      {/* Floating Bubbles Component */}
      <FloatingBubbles />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center">
          <Button
            variant="outline"
            size="sm"
            className="mr-4 border-gray-300 dark:border-gray-700" 
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
          
          <h1 className="text-3xl font-bold font-display tracking-tight text-gray-900 dark:text-white">
            Order <span className="hero-gradient dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-yooboba-blue dark:to-yooboba-pink">Receipt</span>
          </h1>
        </div>
        
        <ScrollAnimation animation="animate-reveal-text" delay={300}>
          <div ref={receiptRef} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            {/* Success Banner */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6 flex items-center">
              <div className="bg-green-100 dark:bg-green-800 rounded-full p-1 mr-3">
                <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-medium text-green-800 dark:text-green-400">Payment Successful</h3>
                <p className="text-sm text-green-700 dark:text-green-500">
                  Thank you for your order! Your payment has been processed successfully.
                </p>
              </div>
            </div>
            
            {/* Receipt Header */}
            <div className="flex flex-col md:flex-row justify-between mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
              <div>
                <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yooboba-purple to-yooboba-pink dark:from-yooboba-blue dark:to-yooboba-pink mb-1">
                  YooBoba Premium Pearls
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Order #: {order_id}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Payment #: {payment_id}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Date: {formatDate(timestamp)}</p>
              </div>
              <div className="mt-4 md:mt-0 md:text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-white">Payment Method</div>
                <p className="text-gray-600 dark:text-gray-400">{method || "Credit Card"}</p>
                <div className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Currency</div>
                <p className="text-gray-600 dark:text-gray-400">{payhere_currency}</p>
              </div>
            </div>
            
            {/* Customer Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Customer Information</h3>
                <div className="text-gray-700 dark:text-gray-300">
                  <p>{customer?.first_name} {customer?.last_name}</p>
                  <p>{customer?.email}</p>
                  <p>{customer?.phone}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Shipping Address</h3>
                <div className="text-gray-700 dark:text-gray-300">
                  <p>{shipping_address?.address_line_1}</p>
                  {shipping_address?.address_line_2 && <p>{shipping_address.address_line_2}</p>}
                  <p>{shipping_address?.city}, {shipping_address?.state} {shipping_address?.postal_code}</p>
                  <p>{shipping_address?.country}</p>
                </div>
              </div>
            </div>
            
            {/* Order Items */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h3>
            <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 mb-6">
              <table className="w-full">
                <thead>
                  <tr className="text-sm text-left text-gray-500 dark:text-gray-400">
                    <th className="pb-3">Product</th>
                    <th className="pb-3 text-center">Qty</th>
                    <th className="pb-3 text-right">Price</th>
                    <th className="pb-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {items && items.map((item, index) => (
                    <tr key={index} className="text-gray-700 dark:text-gray-300">
                      <td className="py-3 pr-2">
                        <div className="font-medium">{item.name}</div>
                        {item.variant && <div className="text-sm text-gray-500 dark:text-gray-400">{item.variant}</div>}
                      </td>
                      <td className="py-3 text-center">{item.quantity}</td>
                      <td className="py-3 text-right">${item.price.toFixed(2)}</td>
                      <td className="py-3 text-right">${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Order Totals */}
            <div className="space-y-2 text-right mb-6">
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Thank You Message */}
            <div className="text-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300">
                Thank you for choosing YooBoba Premium Pearls! Your order will be processed within 24 hours.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                If you have any questions about your order, please contact our customer service at support@yooboba.com
              </p>
            </div>
          </div>
        </ScrollAnimation>
        
        {/* Download Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleDownloadReceipt}
            disabled={isGeneratingPDF}
            className="bg-yooboba-gradient hover:opacity-90 text-white font-semibold py-3 px-6 rounded-md dark:shadow-glow-sm"
          >
            {isGeneratingPDF ? (
              <>
                <span className="animate-pulse">Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="h-5 w-5 mr-2" />
                Download Receipt
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderReceipt;