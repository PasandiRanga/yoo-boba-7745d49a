import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Order, OrderStatus } from "@/models/OrderModel";

// Extended interfaces to handle database field variations
interface DatabaseCustomer {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  emailaddress?: string;
  contactno?: string;
}

interface DatabaseOrder extends Omit<Order, 'customer' | 'total_amount' | 'payment_method'> {
  customer: DatabaseCustomer;
  total_amount?: number;
  total?: number;
  payment_method?: string;
  paymentMethod?: string;
}

interface OrderReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: DatabaseOrder | null;
}

export const OrderReceiptDialog = ({ open, onOpenChange, order }: OrderReceiptDialogProps) => {
  if (!order) return null;

  // Add safety checks for order data
  const orderId = order.id || 'N/A';
  const orderStatus = order.status || 'pending';
  const orderItems = order.items || [];
  const orderCustomer = order.customer;
  const orderShippingAddress = order.shippingAddress;

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">🧾 Order Receipt</DialogTitle>
        </DialogHeader>
        
        {/* Receipt Container */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 font-mono text-sm">
          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold">🧋 YOO BOBA 🧋</h2>
            <p className="text-xs text-muted-foreground">Thank you for your order!</p>
            <Separator className="my-2" />
          </div>

          {/* Order Info */}
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span>Order #:</span>
              <span className="font-semibold">{orderId.toString().slice(-8)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Date:</span>
              <span>{order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Status:</span>
              <Badge className={`${getStatusColor(orderStatus)} text-xs`}>
                <span className="mr-1">{getStatusIcon(orderStatus)}</span>
                {orderStatus?.toUpperCase()}
              </Badge>
            </div>
            <Separator className="my-2" />
          </div>

          {/* Customer Info */}
          <div className="mb-4">
            <p className="font-semibold mb-1">Customer:</p>
            <p className="text-xs">{orderCustomer?.firstName || orderCustomer?.first_name || ''} {orderCustomer?.lastName || orderCustomer?.last_name || ''}</p>
            <p className="text-xs">{orderCustomer?.email || orderCustomer?.emailaddress || 'N/A'}</p>
            <p className="text-xs">{orderCustomer?.phone || orderCustomer?.contactno || 'N/A'}</p>
            <Separator className="my-2" />
          </div>

          {/* Items */}
          <div className="mb-4">
            <p className="font-semibold mb-2">Items:</p>
            {orderItems.map((item, index) => (
              <div key={item.id || index} className="mb-2">
                <div className="flex justify-between">
                  <span className="text-xs">{item.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{item.quantity || 0} x Rs.{typeof item.price === 'string' ? parseFloat(item.price) : item.price || 0}</span>
                  <span>Rs.{((typeof item.price === 'string' ? parseFloat(item.price) : item.price || 0) * (item.quantity || 0)).toFixed(2)}</span>
                </div>
              </div>
            ))}
            <Separator className="my-2" />
          </div>

          {/* Total */}
          <div className="mb-4">
            <div className="flex justify-between font-bold">
              <span>TOTAL:</span>
              <span>Rs.{order.total_amount || order.total || 0}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Payment:</span>
              <span>{order.payment_method || order.paymentMethod || 'N/A'}</span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="mb-4">
            <p className="font-semibold mb-1 text-xs">Shipping to:</p>
            <div className="text-xs text-muted-foreground">
              <p>{orderShippingAddress?.street1 || 'N/A'}</p>
              {orderShippingAddress?.street2 && <p>{orderShippingAddress.street2}</p>}
              <p>{orderShippingAddress?.city || 'N/A'}, {orderShippingAddress?.state || 'N/A'}</p>
              <p>{orderShippingAddress?.zipCode || 'N/A'}, {orderShippingAddress?.country || 'N/A'}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground border-t pt-2">
            <p>Thank you for choosing YOO BOBA! 🎉</p>
            <p>Have a bubble-icious day! ✨</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};