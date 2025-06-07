import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, MapPin, CreditCard, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { fetchOrderById } from "@/services/orderService";
import { Order, OrderStatus } from "@/models/OrderModel";

// Layout components
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackToTopButton from "@/components/ui/back-to-top";
import LoadingSpinner from "@/components/ui/loading-spinner";

const OrderDetailPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError("Order ID not provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const orderData = await fetchOrderById(orderId);
        setOrder(orderData);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to load order details");
        toast({
          title: "Error Loading Order",
          description: "We couldn't load the order details. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status?.toLowerCase()) {
      case "pending": return "🕐";
      case "processing": return "📦";
      case "shipped": return "🚚";
      case "delivered": return "✅";
      case "cancelled": return "❌";
      default: return "📦";
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status?.toLowerCase()) {
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "processing": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "shipped": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "delivered": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (error || !order) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow bg-background p-4">
          <div className="max-w-4xl mx-auto">
            <Button onClick={() => navigate(-1)} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Card>
              <CardContent className="text-center py-10">
                <p className="text-destructive mb-4">{error || "Order not found"}</p>
                <Button onClick={() => navigate("/my-orders")}>
                  Return to My Orders
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
        <BackToTopButton />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <Button onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>

          <div className="grid gap-6">
            {/* Order Summary Header */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">Order #{order.id}</CardTitle>
                    <p className="text-muted-foreground mt-2">
                      <Calendar className="h-4 w-4 inline mr-2" />
                      Placed on {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    <span className="mr-1">{getStatusIcon(order.status)}</span>
                    {order.status?.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-semibold">{order.customer.firstName} {order.customer.lastName}</p>
                    <p className="text-muted-foreground">{order.customer.email}</p>
                    <p className="text-muted-foreground">{order.customer.phone}</p>
                    {order.customer.company && (
                      <p className="text-muted-foreground">{order.customer.company}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p><span className="font-semibold">Method:</span> {order.payment_method}</p>
                    <p><span className="font-semibold">Status:</span> {order.paymentStatus}</p>
                    <p><span className="font-semibold">Total:</span> Rs.{order.total_amount}</p>
                    {order.paymentId && (
                      <p><span className="font-semibold">Payment ID:</span> {order.paymentId}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p>{order.shippingAddress.street1}</p>
                    {order.shippingAddress.street2 && (
                      <p>{order.shippingAddress.street2}</p>
                    )}
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                    <p>{order.shippingAddress.zipCode}</p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Billing Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Billing Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p>{order.billingAddress.street1}</p>
                    {order.billingAddress.street2 && (
                      <p>{order.billingAddress.street2}</p>
                    )}
                    <p>{order.billingAddress.city}, {order.billingAddress.state}</p>
                    <p>{order.billingAddress.zipCode}</p>
                    <p>{order.billingAddress.country}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={item.id || index}>
                      <div className="flex justify-between items-center py-2">
                        <div className="flex-1">
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-muted-foreground">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">Rs.{item.price} each</p>
                        <p className="font-semibold min-w-20 text-right">Rs.{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      {index < order.items.length - 1 && <Separator />}
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between items-center pt-4">
                    <p className="text-xl font-bold">Total Amount:</p>
                    <p className="text-xl font-bold">Rs.{order.total_amount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default OrderDetailPage;