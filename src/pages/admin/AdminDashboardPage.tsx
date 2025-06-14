import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/adminContext';
import { useAdminData } from '../../hooks/useAdminData';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { useToast } from '../../hooks/use-toast';
import { ProductsTab } from '../../components/admin/ProductsTab';
import { 
  LogOut, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Users, 
  Edit, 
  Trash2, 
  Plus,
  Eye 
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../components/ui/alert-dialog';

interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface Address {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
  customer: Customer;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
}

interface Product {
  product_id: string;
  name: string;
  description: string;
  images: string;
  attributes: {
    color: string;
    flavor: string;
    texture: string;
    cookingTime: string;
    ingredients: string[];
    storageInstructions: string;
  };
  featured: boolean;
  variants: Array<{
    weight: string;
    price: number;
    stock: number;
  }>;
}

const AdminDashboardPage: React.FC = () => {
  const { admin, logout } = useAdmin();
  const { 
    orders, 
    products, 
    isLoading, 
    handleOrderStatusUpdate, 
    handleStockUpdate, 
    handlePriceUpdate, 
    handleAddProduct, 
    handleUpdateProduct, 
    handleDeleteProduct 
  } = useAdminData();
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [cityFilter, setCityFilter] = useState<string>('');
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [priceUpdateDialog, setPriceUpdateDialog] = useState<{open: boolean, productId: string, weight: string, currentPrice: number}>({
    open: false,
    productId: '',
    weight: '',
    currentPrice: 0
  });
  const [stockUpdateDialog, setStockUpdateDialog] = useState<{open: boolean, productId: string, weight: string, currentStock: number}>({
    open: false,
    productId: '',
    weight: '',
    currentStock: 0
  });
  const [newPriceValue, setNewPriceValue] = useState('');
  const [newStockValue, setNewStockValue] = useState('');
  const [newProduct, setNewProduct] = useState({
    productId: '',
    name: '',
    description: '',
    images: '',
    attributes: {
      color: '',
      flavor: '',
      texture: 'Chewy',
      cookingTime: '',
      ingredients: [],
      storageInstructions: ''
    },
    featured: false,
    variants: [
      { weight: '250g', price: 0, stock: 0 },
      { weight: '500g', price: 0, stock: 0 },
      { weight: '1kg', price: 0, stock: 0 }
    ]
  });
  const { toast } = useToast();

  useEffect(() => {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status.toLowerCase() === statusFilter.toLowerCase());
    }

    // Filter by date
    if (dateFilter) {
      filtered = filtered.filter(order => 
        new Date(order.created_at).toISOString().split('T')[0] === dateFilter
      );
    }

    // Filter by city
    if (cityFilter) {
      filtered = filtered.filter(order => 
        order.shippingAddress?.city?.toLowerCase().includes(cityFilter.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  }, [orders, statusFilter, dateFilter, cityFilter]);

  const onAddProduct = async () => {
    const success = await handleAddProduct(newProduct);
    if (success) {
      setNewProduct({
        productId: '',
        name: '',
        description: '',
        images: '',
        attributes: {
          color: '',
          flavor: '',
          texture: 'Chewy',
          cookingTime: '',
          ingredients: [],
          storageInstructions: ''
        },
        featured: false,
        variants: [
          { weight: '250g', price: 0, stock: 0 },
          { weight: '500g', price: 0, stock: 0 },
          { weight: '1kg', price: 0, stock: 0 }
        ]
      });
      setShowAddProductForm(false);
    }
  };

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

  const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const totalProducts = products.length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {admin?.name}</p>
            </div>
            <Button variant="outline" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rs. {totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Filter Section */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="statusFilter">Filter by Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                      onChange={(e) => setDateFilter(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cityFilter">Filter by City</Label>
                    <Input
                      id="cityFilter"
                      placeholder="Enter city name"
                      value={cityFilter}
                      onChange={(e) => setCityFilter(e.target.value)}
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
                                          <p>{order.shippingAddress?.street}</p>
                                          <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                                          <p>{order.shippingAddress?.postalCode}</p>
                                          <p>{order.shippingAddress?.country}</p>
                                        </div>
                                      </div>
                                      <div>
                                        <h3 className="font-semibold mb-2">Billing Address</h3>
                                        <div className="text-sm">
                                          <p>{order.billingAddress?.street}</p>
                                          <p>{order.billingAddress?.street}</p>
                                          <p>{order.billingAddress?.city}, {order.billingAddress?.state}</p>
                                          <p>{order.billingAddress?.postalCode}</p>
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
                                  onValueChange={(status) => handleOrderStatusUpdate(order.id, status)}
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
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <ProductsTab
              products={products}
              showAddProductForm={showAddProductForm}
              newProduct={newProduct}
              onToggleAddProductForm={() => setShowAddProductForm(!showAddProductForm)}
              onNewProductChange={setNewProduct}
              onAddProduct={onAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Weight</TableHead>
                        <TableHead>Current Price</TableHead>
                        <TableHead>Current Stock</TableHead>
                        <TableHead>Update Price</TableHead>
                        <TableHead>Update Stock</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) =>
                        product.variants.map((variant) => (
                          <TableRow key={`${product.product_id}-${variant.weight}`}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{variant.weight}</TableCell>
                            <TableCell>Rs. {(Number(variant.price) || 0).toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge variant={variant.stock < 10 ? "destructive" : "default"}>
                                {variant.stock}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setPriceUpdateDialog({
                                    open: true,
                                    productId: product.product_id,
                                    weight: variant.weight,
                                    currentPrice: variant.price
                                  });
                                  setNewPriceValue('');
                                }}
                              >
                                Update Price
                              </Button>
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setStockUpdateDialog({
                                    open: true,
                                    productId: product.product_id,
                                    weight: variant.weight,
                                    currentStock: variant.stock
                                  });
                                  setNewStockValue('');
                                }}
                              >
                                Add Stock
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>

      {/* Price Update Dialog */}
      <Dialog open={priceUpdateDialog.open} onOpenChange={(open) => setPriceUpdateDialog(prev => ({...prev, open}))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Price</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Current price: Rs. {priceUpdateDialog.currentPrice.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Product: {products.find(p => p.product_id === priceUpdateDialog.productId)?.name} - {priceUpdateDialog.weight}
              </p>
            </div>
            <div>
              <Label htmlFor="newPrice">New Price (Rs.)</Label>
              <Input
                id="newPrice"
                type="number"
                placeholder="Enter new price"
                value={newPriceValue}
                onChange={(e) => setNewPriceValue(e.target.value)}
                step="0.01"
                min="0"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setPriceUpdateDialog(prev => ({...prev, open: false}))}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  const newPrice = Number(newPriceValue);
                  if (newPrice > 0) {
                    handlePriceUpdate(priceUpdateDialog.productId, priceUpdateDialog.weight, newPrice);
                    setPriceUpdateDialog(prev => ({...prev, open: false}));
                    setNewPriceValue('');
                  }
                }}
                disabled={!newPriceValue || Number(newPriceValue) <= 0}
              >
                Update Price
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stock Update Dialog */}
      <Dialog open={stockUpdateDialog.open} onOpenChange={(open) => setStockUpdateDialog(prev => ({...prev, open}))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Stock</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Current stock: {stockUpdateDialog.currentStock} items
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Product: {products.find(p => p.product_id === stockUpdateDialog.productId)?.name} - {stockUpdateDialog.weight}
              </p>
            </div>
            <div>
              <Label htmlFor="newStock">Stock to Add</Label>
              <Input
                id="newStock"
                type="number"
                placeholder="Enter quantity to add"
                value={newStockValue}
                onChange={(e) => setNewStockValue(e.target.value)}
                min="1"
              />
              {newStockValue && Number(newStockValue) > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  New total stock will be: {stockUpdateDialog.currentStock + Number(newStockValue)} items
                </p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setStockUpdateDialog(prev => ({...prev, open: false}))}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  const stockToAdd = Number(newStockValue);
                  if (stockToAdd > 0) {
                    handleStockUpdate(stockUpdateDialog.productId, stockUpdateDialog.weight, stockToAdd);
                    setStockUpdateDialog(prev => ({...prev, open: false}));
                    setNewStockValue('');
                  }
                }}
                disabled={!newStockValue || Number(newStockValue) <= 0}
              >
                Add Stock
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboardPage;