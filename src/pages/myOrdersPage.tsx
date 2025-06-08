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
import { generateAndDownloadReceipt } from "@/components/order/downloadOrder";


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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState<string | null>(null); // Track which order is being downloaded


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
      case "pending": return "⏳";
      case "processing": return "🔄";
      case "shipped": return "🚚";
      case "delivered": return "✅";
      case "cancelled": return "❌";
      default: return "📦";
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status?.toLowerCase()) {
      case "pending": return "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200 dark:from-yellow-900/30 dark:to-orange-900/30 dark:text-yellow-300 dark:border-yellow-700";
      case "processing": return "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200 dark:from-blue-900/30 dark:to-cyan-900/30 dark:text-blue-300 dark:border-blue-700";
      case "shipped": return "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200 dark:from-purple-900/30 dark:to-pink-900/30 dark:text-purple-300 dark:border-purple-700";
      case "delivered": return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-300 dark:border-green-700";
      case "cancelled": return "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200 dark:from-red-900/30 dark:to-pink-900/30 dark:text-red-300 dark:border-red-700";
      default: return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200 dark:from-gray-900/30 dark:to-slate-900/30 dark:text-gray-300 dark:border-gray-700";
    }
  };

  const handleViewOrder = async (orderId: string) => {
    try {
      const orderData = await fetchOrderById(orderId);
      const extractOrder = orderData.order;
      console.log("Fetched Order Data:", orderData);
      console.log("Extracted Order:", extractOrder);
      setSelectedOrder(extractOrder as unknown as Order);
      setIsReceiptDialogOpen(true);
    } catch (error) {
      toast({
        title: "Error Loading Order",
        description: "We couldn't load the order details. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadReceipt = async (order: Order) => {
    setIsDownloading(order.id); // Set loading state for this specific order
    try {
      await generateAndDownloadReceipt(order, toast);
    } finally {
      setIsDownloading(null); // Clear loading state
    }
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
      <main className="flex-grow bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 p-4 relative overflow-hidden">
        {/* Floating Boba Bubbles Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-4 h-4 bg-yooboba-purple rounded-full animate-bounce opacity-20"></div>
          <div className="absolute top-20 right-20 w-6 h-6 bg-yooboba-pink rounded-full animate-bounce opacity-30" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-32 left-16 w-3 h-3 bg-purple-400 rounded-full animate-bounce opacity-25" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 right-32 w-5 h-5 bg-pink-400 rounded-full animate-bounce opacity-20" style={{animationDelay: '0.5s'}}></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yooboba-purple to-yooboba-pink bg-clip-text text-transparent mb-2">
              🧋 My Boba Orders ✨
            </h1>
            <p className="text-gray-600 dark:text-gray-300">Track your bubble tea adventures!</p>
          </div>
          
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl shadow-purple-500/10">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-semibold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Order History 📋
              </CardTitle>
            </CardHeader>
            <CardContent>
            <div className="mb-8 p-6 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200/50 dark:border-purple-800/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="relative flex-grow">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500 text-lg">🔍</div>
                  <Input
                    placeholder="Search by Order ID or Item... 🧋"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/80 dark:bg-gray-800/80 border-purple-200 dark:border-purple-700 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:w-auto w-full">
                  <div className="w-full sm:w-52">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="bg-white/80 dark:bg-gray-800/80 border-purple-200 dark:border-purple-700 rounded-xl shadow-sm">
                        <SelectValue placeholder="📋 Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">🌟 All Statuses</SelectItem>
                        <SelectItem value="pending">⏳ Pending</SelectItem>
                        <SelectItem value="processing">🔄 Processing</SelectItem>
                        <SelectItem value="shipped">🚚 Shipped</SelectItem>
                        <SelectItem value="delivered">✅ Delivered</SelectItem>
                        <SelectItem value="cancelled">❌ Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full sm:w-52">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="bg-white/80 dark:bg-gray-800/80 border-purple-200 dark:border-purple-700 rounded-xl shadow-sm">
                        <SelectValue placeholder="📊 Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date-desc">📅 Date (Newest)</SelectItem>
                        <SelectItem value="date-asc">📅 Date (Oldest)</SelectItem>
                        <SelectItem value="amount-desc">💰 Amount (High to Low)</SelectItem>
                        <SelectItem value="amount-asc">💰 Amount (Low to High)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {error ? (
              <div className="text-center py-10">
                <p className="mb-4 text-red-600">{error}</p>
                <Button onClick={handleRetryFetch}>Retry</Button>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🧋</div>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">No boba orders yet!</p>
                <p className="text-gray-500 dark:text-gray-500">Time to get your bubble tea fix! 🥤</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order, index) => (
                  <div 
                    key={order.id} 
                    className="group relative bg-gradient-to-br from-white/90 to-purple-50/50 dark:from-gray-800/90 dark:to-purple-900/20 rounded-3xl p-6 border border-purple-200/50 dark:border-purple-800/50 shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-2 backdrop-blur-sm"
                    style={{animationDelay: `${index * 100}ms`}}
                  >
                    {/* Cute decorative elements */}
                    <div className="absolute top-4 right-4 opacity-20 text-2xl animate-pulse">🧋</div>
                    <div className="absolute bottom-4 left-4 opacity-10 text-xl">✨</div>
                    
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold bg-gradient-to-r from-yooboba-purple to-yooboba-pink bg-clip-text text-transparent">
                            Order #{order.id?.toString().slice(-6)} 🧾
                          </h3>
                          <Badge className={`px-3 py-1 rounded-full font-medium text-sm shadow-md hover:scale-105 transition-transform ${getStatusColor(order.status)}`}>
                            <span className="mr-1 text-base">{getStatusIcon(order.status)}</span>
                            {order.status?.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                            <span className="text-purple-500">📅</span>
                            <span>{new Date(order.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                            <span className="text-green-500">💰</span>
                            <span className="font-semibold text-green-600 dark:text-green-400">Rs.{order.total_amount}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                            <span className="text-blue-500">💳</span>
                            <span className="capitalize">{order.payment_method?.replace('_', ' ')}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Items Section */}
                    <div className="mb-6">
                      <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                        <span className="text-pink-500">🛍️</span>
                        Your Delicious Items
                      </h4>
                      <div className="space-y-2">
                        {(order.items || []).map((item, itemIndex) => (
                          <div 
                            key={item.id} 
                            className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50/80 to-pink-50/80 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl border border-purple-100 dark:border-purple-800/50 hover:scale-[1.02] transition-transform duration-200"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xl">🧋</span>
                              <div>
                                <p className="font-medium text-gray-800 dark:text-gray-200">{item.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Qty: {item.quantity} × Rs.{item.price}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-purple-600 dark:text-purple-400">
                                Rs.{(parseFloat(String(item.price)) * (item.quantity || 1)).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        size="sm" 
                        onClick={() => handleViewOrder(order.id)}
                        className="flex-1 bg-gradient-to-r from-yooboba-purple to-yooboba-pink hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                      >
                        <span className="mr-2">👀</span>
                        View Details
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDownloadReceipt(order)}
                        disabled={isDownloading === order.id}
                        className="flex-1 border-2 border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-xl font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                      >
                        {isDownloading === order.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Downloading...
                          </>
                        ) : (
                          <>
                            <span className="mr-2">📄</span>
                            Download Receipt
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-400/5 to-pink-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          </Card>
        </div>
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
