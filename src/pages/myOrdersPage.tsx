import { useState, useEffect } from "react";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/authContext";
import { Order, OrderStatus } from "@/models/OrderModel";
import { fetchOrdersByCustomer, fetchOrderById } from "@/services/orderService";
import { OrderReceiptDialog } from "@/components/order/OrderReceiptDialog";

// Layout components
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackToTopButton from "@/components/ui/back-to-top";
import LoadingSpinner from "@/components/ui/loading-spinner";

const MyOrdersPage = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date-desc");
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!user || (!user.customerid && !user.emailaddress)) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const identifier = user.customerid || user.emailaddress;
        const fetchedOrders = await fetchOrdersByCustomer(identifier);
        setOrders(fetchedOrders);
        setFilteredOrders(fetchedOrders);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to load orders");
        toast({
          title: "Error Loading Orders",
          description: "We couldn't load your orders. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchUserOrders();
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [user, isAuthenticated, authLoading]);

  useEffect(() => {
    let filtered = [...orders];

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.items || []).some(item =>
          item.name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(order =>
        order.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "date-asc":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "amount-desc":
          return parseFloat(String(b.total_amount)) - parseFloat(String(a.total_amount));
        case "amount-asc":
          return parseFloat(String(a.total_amount)) - parseFloat(String(b.total_amount));
        default:
          return 0;
      }
    });

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, sortBy]);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status?.toLowerCase()) {
      case "pending": return <Clock className="h-4 w-4" />;
      case "processing": return <Package className="h-4 w-4" />;
      case "shipped": return <Truck className="h-4 w-4" />;
      case "delivered": return <CheckCircle className="h-4 w-4" />;
      case "cancelled": return <XCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
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

  const handleViewOrder = async (orderId: string) => {
    console.log(`Fetching details for order ID1: ${orderId}`);
    try {
      const orderData = await fetchOrderById(orderId);
      console.log(orderData);
      setSelectedOrder(orderData);
      setIsReceiptDialogOpen(true);
    } catch (error) {
      toast({
        title: "Error Loading Order",
        description: "We couldn't load the order details. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadReceipt = (order: Order) => {
    toast({
      title: "Download Started",
      description: `Receipt for order #${order.id} is being downloaded.`,
    });
  };

  const handleRetryFetch = () => {
    if (user) {
      setError(null);
      const fetchUserOrders = async () => {
        try {
          setIsLoading(true);
          const identifier = user.customerid || user.emailaddress;
          const fetchedOrders = await fetchOrdersByCustomer(identifier);
          setOrders(fetchedOrders);
          setFilteredOrders(fetchedOrders);
        } catch (error) {
          setError(error instanceof Error ? error.message : "Failed to load orders");
        } finally {
          setIsLoading(false);
        }
      };
      fetchUserOrders();
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 dark:text-white p-4">
        <Card>
          <CardHeader>
            <CardTitle>My Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <Input
                placeholder="Search by Order ID or Item"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="flex-grow"
              />
              <div className="w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-48">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Date (Newest)</SelectItem>
                    <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                    <SelectItem value="amount-desc">Amount (High to Low)</SelectItem>
                    <SelectItem value="amount-asc">Amount (Low to High)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error ? (
              <div className="text-center py-10">
                <p className="mb-4 text-red-600">{error}</p>
                <Button onClick={handleRetryFetch}>Retry</Button>
              </div>
            ) : filteredOrders.length === 0 ? (
              <p className="text-center py-10 text-gray-600 dark:text-gray-400">No orders found.</p>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map(order => (
                  <Card key={order.id} className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">Order ID: {order.id}</h3>
                        <p>Date: {new Date(order.created_at).toLocaleString()}</p>
                        <p>Total Amount: Rs.{order.total_amount}</p>
                        <p>Payment: {order.payment_method}</p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(order.status)} {order.status}
                        </div>
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <h4 className="font-semibold">Items:</h4>
                      <ul className="list-disc ml-5">
                        {(order.items || []).map(item => (
                          <li key={item.id}>
                            {item.name} x {item.quantity} - Rs.{item.price}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" onClick={() => handleViewOrder(order.id)}>
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDownloadReceipt(order)}>
                        Download Receipt
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
      <BackToTopButton />
      
      <OrderReceiptDialog 
        open={isReceiptDialogOpen}
        onOpenChange={setIsReceiptDialogOpen}
        order={selectedOrder}
      />
    </div>
  );
};

export default MyOrdersPage;
