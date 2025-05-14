import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Trash } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { useState, useEffect } from "react";
import { IncrementController, DecrementController } from "@/components/ui/quantityController";
import CustomCheckbox from "@/components/ui/customCheckBox";

const CartPage = () => {
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    selectedItems, 
    toggleItemSelection, 
    toggleSelectAll, 
    selectedSubtotal,
    selectedItemsCount 
  } = useCart();
  
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [quantityState, setQuantityState] = useState<Record<string, boolean>>({});

  // Initialize quantity state when cart items change
  useEffect(() => {
    const initialQuantityState: Record<string, boolean> = {};
    items.forEach(item => {
      initialQuantityState[item.id] = false;
    });
    setQuantityState(initialQuantityState);
  }, [items]);

  const handleQuantityChange = (id: string, newQty: number) => {
    if (newQty >= 1 && newQty <= 10) {
      updateQuantity(id, newQty);
    }
  };

  const handleQuantityFlip = (id: string, isIncrease: boolean) => {
    const currentQuantity = items.find(item => item.id === id)?.quantity || 1;
    const newQuantity = isIncrease ? currentQuantity + 1 : currentQuantity - 1;
    
    if (newQuantity >= 1 && newQuantity <= 10) {
      updateQuantity(id, newQuantity);
      
      // Toggle the flip state
      setQuantityState(prev => ({
        ...prev,
        [id]: !prev[id]
      }));
    }
  };

  // Check if all items are selected
  const areAllItemsSelected = items.length > 0 && items.every(item => selectedItems[item.id]);

  // Calculate order summary based on selected items
  const tax = selectedSubtotal * 0.08; // 8% tax
  const total = selectedSubtotal + tax;

  // Handle proceed to checkout - only proceed if there are selected items
  const handleProceedToCheckout = (e: React.MouseEvent) => {
    if (selectedItemsCount === 0) {
      e.preventDefault();
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold font-display mb-8 text-gray-900 dark:text-white">Your Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-16 h-16 mb-6 text-gray-400 dark:text-gray-500">
              <ShoppingCart size={64} />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Your cart is empty</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Button asChild className="bg-yooboba-gradient hover:opacity-90 dark:shadow-glow-sm">
              <Link to="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 transition-colors duration-300">
                <div className="hidden md:grid grid-cols-12 p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800 font-medium text-sm text-gray-700 dark:text-gray-300">
                  <div className="col-span-1 flex items-center">
                    <CustomCheckbox 
                      checked={areAllItemsSelected} 
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                    />
                  </div>
                  <div className="col-span-5">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-center">Subtotal</div>
                </div>

                {items.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 md:grid-cols-12 p-4 border-b dark:border-gray-700 items-center gap-4 md:gap-0"
                  >
                    <div className="col-span-1 flex items-center">
                      <CustomCheckbox 
                        checked={selectedItems[item.id] || false}
                        onChange={() => toggleItemSelection(item.id)}
                      />
                    </div>
                    
                    <div className="col-span-5 flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className={`w-16 h-16 object-cover rounded dark:brightness-95 ${!selectedItems[item.id] ? 'opacity-50' : ''}`}
                      />
                      <div>
                        <Link
                          to={`/products/${item.id}`}
                          className={`font-medium hover:text-yooboba-purple dark:text-white dark:hover:text-yooboba-blue ${!selectedItems[item.id] ? 'text-gray-500 dark:text-gray-400' : ''}`}
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.weight}</p>
                      </div>
                    </div>

                    <div className={`col-span-2 text-center ${selectedItems[item.id] ? 'text-gray-900 dark:text-gray-300' : 'text-gray-500 dark:text-gray-500'}`}>
                      <div className="md:hidden text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Price:
                      </div>
                      {formatPrice(item.price)}
                    </div>

                    <div className="col-span-2 flex justify-center">
                      <div className="md:hidden text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Quantity:
                      </div>
                      <div className="flex items-center">
                        {/* Decrement controller */}
                        <div className={selectedItems[item.id] ? "" : "opacity-50"}>
                          <DecrementController
                            checked={quantityState[item.id] || false}
                            onChange={() => selectedItems[item.id] && item.quantity > 1 && handleQuantityFlip(item.id, false)}
                            disabled={!selectedItems[item.id] || item.quantity <= 1}
                          />
                        </div>
                        
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.id,
                              parseInt(e.target.value) || 1
                            )
                          }
                          disabled={!selectedItems[item.id]}
                          className={`size-15 h-8 w-12 mx-2 text-center p-0 bg-white dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 ${!selectedItems[item.id] ? 'opacity-50' : ''}`}
                        />
                        
                        {/* Increment controller */}
                        <div className={selectedItems[item.id] ? "" : "opacity-50"}>
                          <IncrementController
                            checked={!quantityState[item.id] || false}
                            onChange={() => selectedItems[item.id] && item.quantity < 10 && handleQuantityFlip(item.id, true)}
                            disabled={!selectedItems[item.id] || item.quantity >= 10}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2 text-center flex items-center justify-between md:justify-center">
                      <div className="md:hidden text-sm text-gray-500 dark:text-gray-400">
                        Subtotal:
                      </div>
                      <div className="flex items-center">
                        <span className={`font-medium ${selectedItems[item.id] ? 'text-gray-900 dark:text-gray-300' : 'text-gray-500 dark:text-gray-500'}`}>
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-gray-700"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="p-4 flex justify-between">
                  <Button 
                    variant="ghost" 
                    onClick={clearCart}
                    className="dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    Clear Cart
                  </Button>
                  <Button 
                    asChild 
                    variant="outline"
                    className="dark:border-yooboba-blue dark:text-yooboba-blue dark:hover:bg-gray-800"
                  >
                    <Link to="/products">Continue Shopping</Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6 transition-colors duration-300">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Order Summary</h2>
                
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {selectedItemsCount === 0 ? (
                    <p>No items selected</p>
                  ) : selectedItemsCount === items.length ? (
                    <p>All items selected ({items.length})</p>
                  ) : (
                    <p>{selectedItemsCount} of {items.length} items selected</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-900 dark:text-gray-300">
                    <span>Subtotal</span>
                    <span>{formatPrice(selectedSubtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-900 dark:text-gray-300">
                    <span>Tax (8%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  
                  <div className="border-t dark:border-gray-700 pt-3 mt-3 flex justify-between font-semibold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
                
                <Button 
                  className={`w-full mt-6 ${selectedItemsCount > 0 ? 'bg-yooboba-gradient hover:opacity-90 dark:shadow-glow-sm' : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'} transition-all duration-300`}
                  disabled={selectedItemsCount === 0}
                  onClick={handleProceedToCheckout}
                >
                  Proceed to Checkout {selectedItemsCount > 0 && `(${selectedItemsCount} ${selectedItemsCount === 1 ? 'item' : 'items'})`}
                </Button>
                
                <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                  <p>Shipping will be calculated during checkout</p>
                  <p>Taxes are estimated and will be finalized at checkout</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;