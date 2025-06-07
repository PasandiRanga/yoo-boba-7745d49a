import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Order, OrderStatus } from "@/models/OrderModel";

interface OrderReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

export const OrderReceiptDialog = ({ open, onOpenChange, order }: OrderReceiptDialogProps) => {
  if (!order) return null;

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
              <span className="font-semibold">{order.id.slice(-8)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Date:</span>
              <span>{new Date(order.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Status:</span>
              <Badge className={`${getStatusColor(order.status)} text-xs`}>
                <span className="mr-1">{getStatusIcon(order.status)}</span>
                {order.status?.toUpperCase()}
              </Badge>
            </div>
            <Separator className="my-2" />
          </div>

          {/* Customer Info */}
          <div className="mb-4">
            <p className="font-semibold mb-1">Customer:</p>
            <p className="text-xs">{order.customer.firstName} {order.customer.lastName}</p>
            <p className="text-xs">{order.customer.email}</p>
            <p className="text-xs">{order.customer.phone}</p>
            <Separator className="my-2" />
          </div>

          {/* Items */}
          <div className="mb-4">
            <p className="font-semibold mb-2">Items:</p>
            {order.items.map((item, index) => (
              <div key={item.id || index} className="mb-2">
                <div className="flex justify-between">
                  <span className="text-xs">{item.name}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{item.quantity} x Rs.{item.price}</span>
                  <span>Rs.{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            ))}
            <Separator className="my-2" />
          </div>

          {/* Total */}
          <div className="mb-4">
            <div className="flex justify-between font-bold">
              <span>TOTAL:</span>
              <span>Rs.{order.total_amount}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Payment:</span>
              <span>{order.payment_method}</span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="mb-4">
            <p className="font-semibold mb-1 text-xs">Shipping to:</p>
            <div className="text-xs text-muted-foreground">
              <p>{order.shippingAddress.street1}</p>
              {order.shippingAddress.street2 && <p>{order.shippingAddress.street2}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
              <p>{order.shippingAddress.zipCode}, {order.shippingAddress.country}</p>
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