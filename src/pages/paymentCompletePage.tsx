// src/pages/PaymentCompletePage.tsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CheckCircle, Loader2, User, MapPin, Package, CreditCard, Heart, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingBobaPearls } from "@/components/ui/floatingBobaPearls";
import { toast } from "@/components/ui/use-toast";
import { fetchOrderById } from "@/services/orderService";
import { Order } from "@/models/OrderModel";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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
      emailaddress:string;
      contactno:string;
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
      email: dbOrder.customer.email || dbOrder.customer.emailaddress,
      phone: dbOrder.customer.phone || dbOrder.customer.contactno,
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
  const [isGeneratingReceipt, setIsGeneratingReceipt] = useState(false);

  // Function to download receipt as PDF
  // Update the downloadReceipt function in your PaymentCompletePage.tsx
const downloadReceipt = async () => {
  try {
    setIsGeneratingReceipt(true);
    
    // Create a temporary div with only the essential receipt content
    const receiptContent = document.createElement("div");
    receiptContent.style.padding = "20px";
    receiptContent.style.backgroundColor = "white";
    receiptContent.style.color = "black";
    receiptContent.style.maxWidth = "800px";
    receiptContent.style.margin = "0 auto";

    // Add company header
    const header = document.createElement("div");
    header.style.textAlign = "center";
    header.style.marginBottom = "20px";
    header.innerHTML = `
      <h1 style="font-size: 24px; font-weight: bold; color: #7e22ce;">YooBoba</h1>
      <p style="font-size: 16px; color: #6b7280;">Order Receipt</p>
      <hr style="border: 1px solid #e5e7eb; margin: 10px 0;">
    `;
    receiptContent.appendChild(header);

    // Add order summary
    const orderSummary = document.createElement("div");
    orderSummary.style.marginBottom = "20px";
    orderSummary.innerHTML = `
      <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #7e22ce;">Order Summary</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div>
          <p><strong>Order Number:</strong> ${order?.id || "N/A"}</p>
          <p><strong>Date:</strong> ${order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}</p>
          <p><strong>Status:</strong> ${order?.status ? capitalize(order.status) : "N/A"}</p>
        </div>
        <div>
          <p><strong>Payment Method:</strong> ${order?.paymentMethod ? order.paymentMethod.replace('_', ' ').toUpperCase() : 'N/A'}</p>
          <p><strong>Payment Status:</strong> ${order?.paymentStatus ? capitalize(order.paymentStatus) : "N/A"}</p>
          <p><strong>Total Amount:</strong> LKR ${order?.total?.toFixed(2) || "0.00"}</p>
        </div>
      </div>
    `;
    receiptContent.appendChild(orderSummary);

    // Add customer information
    const customerInfo = document.createElement("div");
    customerInfo.style.marginBottom = "20px";
    customerInfo.innerHTML = `
      <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #7e22ce;">Customer Information</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div>
          <p><strong>Name:</strong> ${getCustomerName()}</p>
          <p><strong>Email:</strong> ${getCustomerEmail()}</p>
        </div>
        <div>
          <p><strong>Phone:</strong> ${getCustomerPhone()}</p>
          ${customer?.company ? `<p><strong>Company:</strong> ${customer.company}</p>` : ''}
        </div>
      </div>
    `;
    receiptContent.appendChild(customerInfo);

    // Add addresses if they exist
    if (order?.shippingAddress) {
      const shippingAddress = document.createElement("div");
      shippingAddress.style.marginBottom = "20px";
      shippingAddress.innerHTML = `
        <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #7e22ce;">Shipping Address</h2>
        <p>${formatAddress(order.shippingAddress)}</p>
      `;
      receiptContent.appendChild(shippingAddress);
    }

    if (order?.billingAddress) {
      const billingAddress = document.createElement("div");
      billingAddress.style.marginBottom = "20px";
      billingAddress.innerHTML = `
        <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #7e22ce;">Billing Address</h2>
        <p>${formatAddress(order.billingAddress)}</p>
      `;
      receiptContent.appendChild(billingAddress);
    }

    // Add order items table
    if (order?.items && order.items.length > 0) {
      const itemsTable = document.createElement("div");
      itemsTable.style.marginBottom = "20px";
      
      let itemsHTML = `
        <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #7e22ce;">Order Items</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f3e8ff;">
              <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Item</th>
              <th style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">Price</th>
              <th style="padding: 8px; text-align: center; border-bottom: 1px solid #ddd;">Qty</th>
              <th style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">Total</th>
            </tr>
          </thead>
          <tbody>
      `;

      order.items.forEach(item => {
        itemsHTML += `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
            <td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">LKR ${item.price.toFixed(2)}</td>
            <td style="padding: 8px; text-align: center; border-bottom: 1px solid #eee;">${item.quantity}</td>
            <td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">LKR ${(item.price * item.quantity).toFixed(2)}</td>
          </tr>
        `;
      });

      itemsHTML += `
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding: 8px; text-align: right; font-weight: bold;">Total:</td>
              <td style="padding: 8px; text-align: right; font-weight: bold;">LKR ${order.total?.toFixed(2) || "0.00"}</td>
            </tr>
          </tfoot>
        </table>
      `;

      itemsTable.innerHTML = itemsHTML;
      receiptContent.appendChild(itemsTable);
    }

    // Add footer
    const footer = document.createElement("div");
    footer.style.textAlign = "center";
    footer.style.marginTop = "20px";
    footer.style.paddingTop = "10px";
    footer.style.borderTop = "1px solid #e5e7eb";
    footer.style.color = "#6b7280";
    footer.innerHTML = `
      <p>Thank you for your order!</p>
      <p>YooBoba  • ${new Date().getFullYear()}</p>
    `;
    receiptContent.appendChild(footer);

    // Add the temporary div to the body
    document.body.appendChild(receiptContent);

    // Generate the PDF
    const canvas = await html2canvas(receiptContent, {
      scale: 2,
      logging: false,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 190; // Slightly smaller than A4 width
    const pageHeight = 277; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    pdf.save(`YooBoba_Receipt_${order?.id || "order"}.pdf`);

    // Clean up
    document.body.removeChild(receiptContent);

    toast({
      title: "Receipt Downloaded",
      description: "Your receipt has been successfully downloaded.",
    });
  } catch (error) {
    console.error("Error generating receipt:", error);
    toast({
      title: "Error Generating Receipt",
      description: "There was an error generating your receipt. Please try again.",
      variant: "destructive",
    });
  } finally {
    setIsGeneratingReceipt(false);
  }
};

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
          <div className="text-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-purple-200 dark:border-purple-800">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-purple-500" />
            <h1 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">Verifying Payment</h1>
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
  const isGuestOrder = order?.isGuestOrder;
  const customer = order?.customer;


  // Helper function to get customer name
  const getCustomerName = () => {
    if (!customer) return "N/A";
    return `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 
           (isGuestOrder ? "Guest User" : "Registered User");
  };

  // Helper function to get customer email
  const getCustomerEmail = () => {
    if (!customer) return "N/A";
    return customer.email ||"N/A";
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 relative">
        {/* Receipt container with FloatingBobaPearls */}
        <div className="max-w-4xl mx-auto relative" id="receipt">
          <FloatingBobaPearls />
          
          {/* Success Header */}
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-6 border border-purple-200 dark:border-purple-800 relative overflow-hidden">
            <div className="text-center relative">
              <div className="relative inline-block">
                <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4 drop-shadow-lg" />
                <Heart className="h-6 w-6 text-pink-400 absolute -top-2 -right-2 animate-pulse" />
              </div>
              <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Payment Successful! 🎉
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                Thank you for your order! Your boba adventure is being prepared with love 💕
              </p>
              {isGuestOrder && (
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full px-4 py-2 border border-blue-200 dark:border-blue-700">
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    This order was placed as a guest. Consider creating an account to track your boba orders!
                  </p>
                </div>
              )}
            </div>
          </div>

          {order && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Summary */}
              <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-purple-200 dark:border-purple-800 relative overflow-hidden">
                <div className="flex items-center mb-4">
                  <Package className="h-6 w-6 text-purple-500 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Order Summary ✨
                  </h2>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Order Number:</span>
                    <span className="text-gray-900 dark:text-white font-mono bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded">{order.id}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Date:</span>
                    <span className="text-gray-900 dark:text-white">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Status:</span>
                    <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-800 dark:to-emerald-800 dark:text-green-100 rounded-full text-sm font-medium border border-green-200 dark:border-green-700">
                      {capitalize(order.status)} 🚀
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Payment Method:</span>
                    <span className="text-gray-900 dark:text-white">
                      {order.paymentMethod ? order.paymentMethod.replace('_', ' ').toUpperCase() : 'N/A'} 💳
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Payment Status:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                      order.paymentStatus === 'paid'
                        ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200 dark:from-green-800 dark:to-emerald-800 dark:text-green-100 dark:border-green-700'
                        : order.paymentStatus === 'pending'
                        ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200 dark:from-yellow-800 dark:to-orange-800 dark:text-yellow-100 dark:border-yellow-700'
                        : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200 dark:from-red-800 dark:to-pink-800 dark:text-red-100 dark:border-red-700'
                    }`}>
                      {capitalize(order.paymentStatus)} {order.paymentStatus === 'paid' ? '✅' : '⏳'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Total Amount:</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      LKR {order.total?.toFixed(2)} 🧾
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-purple-200 dark:border-purple-800 relative overflow-hidden">
                <div className="flex items-center mb-4">
                  <User className="h-6 w-6 text-pink-500 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Customer Information 👤
                  </h2>
                  {isGuestOrder && (
                    <span className="ml-2 px-2 py-1 bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-800 dark:from-orange-800 dark:to-yellow-800 dark:text-orange-100 rounded-full text-xs border border-orange-200 dark:border-orange-700">
                      Guest ✨
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
                <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-purple-200 dark:border-purple-800 relative overflow-hidden">
                  <div className="flex items-center mb-4">
                    <MapPin className="h-6 w-6 text-blue-500 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Shipping Address 🚚
                    </h2>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                    {formatAddress(order.shippingAddress)}
                  </p>
                </div>
              )}

              {/* Billing Address */}
              {order.billingAddress && (
                <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-purple-200 dark:border-purple-800 relative overflow-hidden">
                  <div className="flex items-center mb-4">
                    <MapPin className="h-6 w-6 text-green-500 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Billing Address 💳
                    </h2>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                    {formatAddress(order.billingAddress)}
                  </p>
                </div>
              )}

              {/* Order Items */}
              {order.items && order.items.length > 0 && (
                <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 lg:col-span-2 border border-purple-200 dark:border-purple-800 relative overflow-hidden">
                  <div className="flex items-center mb-6">
                    <CreditCard className="h-6 w-6 text-purple-500 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Your Boba Order Items 🧋
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-4 px-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800 last:border-b-0 hover:shadow-md transition-shadow duration-200">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="font-semibold text-gray-900 dark:text-white text-lg">{item.name}</p>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                            <span className="bg-purple-100 dark:bg-purple-900/50 px-2 py-1 rounded-full">
                              Qty: {item.quantity}
                            </span>
                            <span className="text-purple-600 dark:text-purple-400 font-medium">
                              LKR {item.price.toFixed(2)} each
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            LKR {(item.price * item.quantity).toFixed(2)}
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
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 mt-6 border border-purple-200 dark:border-purple-800 relative overflow-hidden">
            <div className="text-center space-y-6">
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                A confirmation email has been sent to your inbox! Check it out for all the sweet details 📧✨
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate("/")}
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-purple-300"
                >
                  Continue Shopping 🛍️
                </Button>
                <Button
                  onClick={downloadReceipt}
                  disabled={isGeneratingReceipt}
                  variant="outline"
                  className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-400 dark:hover:bg-purple-900/20 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
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
                {!isGuestOrder && (
                  <Button
                    onClick={() => navigate("/my-orders")}
                    variant="outline"
                    className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-400 dark:hover:bg-purple-900/20 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    View My Orders 📋
                  </Button>
                )}
                {isGuestOrder && (
                  <Button
                    onClick={() => navigate("/signUp")}
                    variant="outline"
                    className="border-2 border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
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