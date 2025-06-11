import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/adminContext';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { LogOut } from 'lucide-react';
import { Order, Product, NewProduct, PriceUpdateDialog, StockUpdateDialog } from '../../types/admin';
import { useAdminData } from '../../hooks/useAdminData';
import { StatsCards } from '../../components/admin/StatsCards';
import { OrdersTab } from '../../components/admin/OrdersTab';
import { ProductsTab } from '../../components/admin/ProductsTab';
import { InventoryTab } from '../../components/admin/InventoryTab';
import { UpdateDialogs } from '../../components/admin/UpdateDialogs';

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
    handleDeleteProduct,
  } = useAdminData();

  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [cityFilter, setCityFilter] = useState<string>('');
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [priceUpdateDialog, setPriceUpdateDialog] = useState<PriceUpdateDialog>({
    open: false,
    productId: '',
    weight: '',
    currentPrice: 0
  });
  const [stockUpdateDialog, setStockUpdateDialog] = useState<StockUpdateDialog>({
    open: false,
    productId: '',
    weight: '',
    currentStock: 0
  });
  const [newProduct, setNewProduct] = useState<NewProduct>({
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

  const handleAddProductSubmit = async () => {
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

  const handlePriceUpdateClick = (productId: string, weight: string, currentPrice: number) => {
    setPriceUpdateDialog({
      open: true,
      productId,
      weight,
      currentPrice
    });
  };

  const handleStockUpdateClick = (productId: string, weight: string, currentStock: number) => {
    setStockUpdateDialog({
      open: true,
      productId,
      weight,
      currentStock
    });
  };

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
        <StatsCards orders={orders} products={products} />

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <OrdersTab
              orders={orders}
              filteredOrders={filteredOrders}
              statusFilter={statusFilter}
              dateFilter={dateFilter}
              cityFilter={cityFilter}
              onStatusFilterChange={setStatusFilter}
              onDateFilterChange={setDateFilter}
              onCityFilterChange={setCityFilter}
              onOrderStatusUpdate={handleOrderStatusUpdate}
            />
          </TabsContent>

          <TabsContent value="products">
            <ProductsTab
              products={products}
              showAddProductForm={showAddProductForm}
              newProduct={newProduct}
              onToggleAddProductForm={() => setShowAddProductForm(!showAddProductForm)}
              onNewProductChange={setNewProduct}
              onAddProduct={handleAddProductSubmit}
              onDeleteProduct={handleDeleteProduct}
            />
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryTab
              products={products}
              onUpdatePrice={handlePriceUpdateClick}
              onUpdateStock={handleStockUpdateClick}
            />
          </TabsContent>
        </Tabs>
      </div>

      <UpdateDialogs
        products={products}
        priceUpdateDialog={priceUpdateDialog}
        stockUpdateDialog={stockUpdateDialog}
        onClosePriceDialog={() => setPriceUpdateDialog(prev => ({...prev, open: false}))}
        onCloseStockDialog={() => setStockUpdateDialog(prev => ({...prev, open: false}))}
        onPriceUpdate={handlePriceUpdate}
        onStockUpdate={handleStockUpdate}
      />
    </div>
  );
};

export default AdminDashboardPage;