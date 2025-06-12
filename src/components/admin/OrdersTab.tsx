import React, { useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Eye } from 'lucide-react';
import { Order } from '../../types/admin';

interface OrdersTabProps {
  orders: Order[];
  filteredOrders: Order[];
  statusFilter: string;
  dateFilter: string;
  cityFilter: string;
  onStatusFilterChange: (value: string) => void;
  onDateFilterChange: (value: string) => void;
  onCityFilterChange: (value: string) => void;
  onOrderStatusUpdate: (orderId: string, status: string) => void;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({
  orders,
  filteredOrders,
  statusFilter,
  dateFilter,
  cityFilter,
  onStatusFilterChange,
  onDateFilterChange,
  onCityFilterChange,
  onOrderStatusUpdate,
}) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'secondary';
      case 'processing': return 'default';
      case 'shipped': return 'outline';
      case 'delivered': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Management</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filter Section */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="statusFilter">Filter by Status</Label>
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="dateFilter">Filter by Date</Label>
            <Input
              id="dateFilter"
              type="date"
              value={dateFilter}
              onChange={(e) => onDateFilterChange(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="cityFilter">Filter by City</Label>
            <Input
              id="cityFilter"
              placeholder="Enter city name"
              value={cityFilter}
              onChange={(e) => onCityFilterChange(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">{order.id}</TableCell>
                  <TableCell>
                    {order.customer?.firstName} {order.customer?.lastName}
                  </TableCell>
                  <TableCell>Rs. {(Number(order.total_amount) || 0).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Order Details - {order.id}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <h3 className="font-semibold mb-2">Customer Information</h3>
                                <p><strong>Name:</strong> {order.customer?.firstName} {order.customer?.lastName}</p>
                                <p><strong>Email:</strong> {order.customer?.email}</p>
                                <p><strong>Phone:</strong> {order.customer?.phone}</p>
                              </div>
                              <div>
                                <h3 className="font-semibold mb-2">Order Information</h3>
                                <p><strong>Status:</strong> {order.status}</p>
                                <p><strong>Payment:</strong> {order.payment_method}</p>
                                <p><strong>Total:</strong> Rs. {(Number(order.total_amount) || 0).toFixed(2)}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <h3 className="font-semibold mb-2">Shipping Address</h3>
                                <div className="text-sm">
                                  <p>{order.shippingAddress?.street1}</p>
                                  {order.shippingAddress?.street2 && <p>{order.shippingAddress?.street2}</p>}
                                  <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                                  <p>{order.shippingAddress?.zipCode}</p>
                                  <p>{order.shippingAddress?.country}</p>
                                </div>
                              </div>
                              <div>
                                <h3 className="font-semibold mb-2">Billing Address</h3>
                                <div className="text-sm">
                                  <p>{order.billingAddress?.street1}</p>
                                  {order.billingAddress?.street2 && <p>{order.billingAddress?.street2}</p>}
                                  <p>{order.billingAddress?.city}, {order.billingAddress?.state}</p>
                                  <p>{order.billingAddress?.zipCode}</p>
                                  <p>{order.billingAddress?.country}</p>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h3 className="font-semibold mb-2">Items</h3>
                              <div className="space-y-2">
                                {order.items.map((item, index) => (
                                  <div key={index} className="flex justify-between items-center p-2 border rounded">
                                    <span>{item.name}</span>
                                    <span>{item.quantity}x Rs. {(Number(item.price) || 0).toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      {order.status.toLowerCase() !== 'cancelled' && (
                        <Select
                          value={order.status}
                          onValueChange={(status) => onOrderStatusUpdate(order.id, status)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};