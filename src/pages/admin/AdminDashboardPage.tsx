import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/adminContext';
import { 
  fetchAllOrdersForAdmin, 
  updateOrderStatus, 
  fetchAllProductsWithDetails, 
  updateProductStock, 
  updateProductPrice, 
  addNewProduct,
  deleteProduct 
} from '../../services/adminService';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { useToast } from '../../hooks/use-toast';
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

interface Order {
  id: string;
  total_amount: number;
  status: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
  customer: any;
  items: any[];
  shippingAddress: any;
  billingAddress: any;
}

interface Product {
  product_id: string;
  name: string;
  description: string;
  images: string;
  attributes: any;
  featured: boolean;
  variants: Array<{
    weight: string;
    price: number;
    stock: number;
  }>;
}

const AdminDashboardPage: React.FC = () => {
  const { admin, logout, token } = useAdmin();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
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
    loadData();
  }, [token]);

  const loadData = async () => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      const [ordersData, productsData] = await Promise.all([
        fetchAllOrdersForAdmin(token),
        fetchAllProductsWithDetails(token)
      ]);
      setOrders(ordersData);
      setProducts(productsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrderStatusUpdate = async (orderId: string, status: string) => {
    if (!token) return;
    
    try {
      await updateOrderStatus(orderId, { status }, token);
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const handleStockUpdate = async (productId: string, weight: string, stockToAdd: number) => {
    if (!token) return;
    
    try {
      await updateProductStock({ productId, weight, stock: stockToAdd }, token);
      setProducts(prev => prev.map(product => 
        product.product_id === productId 
          ? {
              ...product,
              variants: product.variants.map(variant =>
                variant.weight === weight ? { ...variant, stock: variant.stock + stockToAdd } : variant
              )
            }
          : product
      ));
      toast({
        title: "Success",
        description: `Added ${stockToAdd} items to stock successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update stock",
        variant: "destructive",
      });
    }
  };

  const handlePriceUpdate = async (productId: string, weight: string, price: number) => {
    if (!token) return;
    
    try {
      await updateProductPrice({ productId, weight, price }, token);
      setProducts(prev => prev.map(product => 
        product.product_id === productId 
          ? {
              ...product,
              variants: product.variants.map(variant =>
                variant.weight === weight ? { ...variant, price } : variant
              )
            }
          : product
      ));
      toast({
        title: "Success",
        description: "Price updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update price",
        variant: "destructive",
      });
    }
  };

  const handleAddProduct = async () => {
    if (!token) return;
    
    try {
      await addNewProduct(newProduct, token);
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
      await loadData();
      toast({
        title: "Success",
        description: "Product added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!token) return;
    
    try {
      await deleteProduct(productId, token);
      setProducts(prev => prev.filter(product => product.product_id !== productId));
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
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
                      {orders.map((order) => (
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
                                <DialogContent className="max-w-4xl">
                                  <DialogHeader>
                                    <DialogTitle>Order Details - {order.id}</DialogTitle>
                                  </DialogHeader>
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
            <div className="space-y-6">
              {/* Products List */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Products List</CardTitle>
                  <Button onClick={() => setShowAddProductForm(!showAddProductForm)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {showAddProductForm ? 'Cancel' : 'Add Product'}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Featured</TableHead>
                          <TableHead>Variants</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product.product_id}>
                            <TableCell className="font-mono">{product.product_id}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>
                              <Badge variant={product.featured ? "default" : "secondary"}>
                                {product.featured ? "Yes" : "No"}
                              </Badge>
                            </TableCell>
                            <TableCell>{product.variants.length} variants</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete this product? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteProduct(product.product_id)}>
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Add New Product Form */}
              {showAddProductForm && (
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Product</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="productId">Product ID</Label>
                        <Input
                          id="productId"
                          value={newProduct.productId}
                          onChange={(e) => setNewProduct(prev => ({ ...prev, productId: e.target.value }))}
                          placeholder="P006"
                        />
                      </div>
                      <div>
                        <Label htmlFor="productName">Product Name</Label>
                        <Input
                          id="productName"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Product Name"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="productDescription">Description</Label>
                      <Textarea
                        id="productDescription"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Product description"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="productImages">Image URL</Label>
                      <Input
                        id="productImages"
                        value={newProduct.images}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, images: e.target.value }))}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="color">Color</Label>
                        <Input
                          id="color"
                          value={newProduct.attributes.color}
                          onChange={(e) => setNewProduct(prev => ({
                            ...prev,
                            attributes: { ...prev.attributes, color: e.target.value }
                          }))}
                          placeholder="Black"
                        />
                      </div>
                      <div>
                        <Label htmlFor="flavor">Flavor</Label>
                        <Input
                          id="flavor"
                          value={newProduct.attributes.flavor}
                          onChange={(e) => setNewProduct(prev => ({
                            ...prev,
                            attributes: { ...prev.attributes, flavor: e.target.value }
                          }))}
                          placeholder="Vanilla"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cookingTime">Cooking Time</Label>
                        <Input
                          id="cookingTime"
                          value={newProduct.attributes.cookingTime}
                          onChange={(e) => setNewProduct(prev => ({
                            ...prev,
                            attributes: { ...prev.attributes, cookingTime: e.target.value }
                          }))}
                          placeholder="25 minutes"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {newProduct.variants.map((variant, index) => (
                        <div key={variant.weight} className="space-y-2">
                          <Label className="font-semibold">{variant.weight}</Label>
                          <div>
                            <Label htmlFor={`price-${index}`} className="text-sm">Price</Label>
                            <Input
                              id={`price-${index}`}
                              type="number"
                              placeholder="Price"
                              value={variant.price}
                              onChange={(e) => {
                                const newVariants = [...newProduct.variants];
                                newVariants[index].price = Number(e.target.value);
                                setNewProduct(prev => ({ ...prev, variants: newVariants }));
                              }}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`stock-${index}`} className="text-sm">Stock</Label>
                            <Input
                              id={`stock-${index}`}
                              type="number"
                              placeholder="Stock"
                              value={variant.stock}
                              onChange={(e) => {
                                const newVariants = [...newProduct.variants];
                                newVariants[index].stock = Number(e.target.value);
                                setNewProduct(prev => ({ ...prev, variants: newVariants }));
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button onClick={handleAddProduct}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
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