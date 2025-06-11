import { useState, useEffect } from 'react';
import { useAdmin } from '../context/adminContext';
import { useToast } from './use-toast';
import { 
  fetchAllOrdersForAdmin, 
  updateOrderStatus, 
  fetchAllProductsWithDetails, 
  updateProductStock, 
  updateProductPrice, 
  addNewProduct,
  deleteProduct 
} from '../services/adminService';
import { Order, Product, NewProduct } from '../types/admin';

export const useAdminData = () => {
  const { token } = useAdmin();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleAddProduct = async (newProduct: NewProduct) => {
    if (!token) return;
    
    try {
      await addNewProduct(newProduct, token);
      await loadData();
      toast({
        title: "Success",
        description: "Product added successfully",
      });
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
      return false;
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

  useEffect(() => {
    loadData();
  }, [token]);

  return {
    orders,
    products,
    isLoading,
    loadData,
    handleOrderStatusUpdate,
    handleStockUpdate,
    handlePriceUpdate,
    handleAddProduct,
    handleDeleteProduct,
  };
};