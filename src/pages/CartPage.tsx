import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Trash, Plus, Minus } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { useState, useEffect } from "react";
import styled from "styled-components";

// Styled Checkbox component with Yooboba gradient
const CustomCheckbox = ({ checked, onChange, className = "" }) => {
  return (
    <StyledWrapper>
      <div className="checkbox-container">
        <label className={`ios-checkbox ${className}`}>
          <input type="checkbox" checked={checked} onChange={onChange} />
          <div className="checkbox-wrapper">
            <div className="checkbox-bg" />
            <svg className="checkbox-icon" viewBox="0 0 24 24" fill="none">
              <path className="check-path" d="M4 12L10 18L20 6" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </label>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .checkbox-container {
    display: flex;
    background: transparent;
    border-radius: 8px;
  }
  .ios-checkbox {
    --checkbox-size: 24px;
    position: relative;
    display: inline-block;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }
  
  .ios-checkbox input {
    display: none;
  }
  .checkbox-wrapper {
    position: relative;
    width: var(--checkbox-size);
    height: var(--checkbox-size);
    border-radius: 6px;
    transition: transform 0.2s ease;
  }
  .checkbox-bg {
    position: absolute;
    inset: 0;
    border-radius: 6px;
    border: 2px solid #d1d5db;
    background: white;
    transition: all 0.2s ease;
  }
  
  .dark .checkbox-bg {
    background: #1f2937;
    border-color: #374151;
  }
  
  .checkbox-icon {
    position: absolute;
    inset: 0;
    margin: auto;
    width: 80%;
    height: 80%;
    color: white;
    transform: scale(0);
    transition: all 0.2s ease;
  }
  .check-path {
    stroke-dasharray: 40;
    stroke-dashoffset: 40;
    transition: stroke-dashoffset 0.3s ease 0.1s;
  }
  
  /* Checked State with gradient */
  .ios-checkbox input:checked + .checkbox-wrapper .checkbox-bg {
    background: linear-gradient(135deg, #f472b6 0%, #8b5cf6 100%);
    border-color: transparent;
  }
  
  /* For dark mode, make the gradient a bit brighter */
  .dark .ios-checkbox input:checked + .checkbox-wrapper .checkbox-bg {
    background: linear-gradient(135deg, #f472b6 0%, #a78bfa 100%);
    box-shadow: 0 0 10px rgba(168, 85, 247, 0.3);
  }
  
  .ios-checkbox input:checked + .checkbox-wrapper .checkbox-icon {
    transform: scale(1);
  }
  .ios-checkbox input:checked + .checkbox-wrapper .check-path {
    stroke-dashoffset: 0;
  }
  
  /* Hover Effects */
  .ios-checkbox:hover .checkbox-wrapper {
    transform: scale(1.05);
  }
  
  /* Active Animation */
  .ios-checkbox:active .checkbox-wrapper {
    transform: scale(0.95);
  }
  
  /* Focus Styles */
  .ios-checkbox input:focus + .checkbox-wrapper .checkbox-bg {
    box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.2);
  }
  
  .dark .ios-checkbox input:focus + .checkbox-wrapper .checkbox-bg {
    box-shadow: 0 0 0 4px rgba(167, 139, 250, 0.3);
  }
  
  /* Animation */
  @keyframes bounce {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }
  .ios-checkbox input:checked + .checkbox-wrapper {
    animation: bounce 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

const CartPage = () => {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const [selectedItems, setSelectedItems] = useState({});
  const [selectedSubtotal, setSelectedSubtotal] = useState(0);

  // Initialize selected items when cart items change
  useEffect(() => {
    const initialSelectedState = {};
    items.forEach(item => {
      // By default, all items are selected
      initialSelectedState[item.id] = true;
    });
    setSelectedItems(initialSelectedState);
  }, [items]);

  // Calculate selected items subtotal whenever selection or items change
  useEffect(() => {
    const newSubtotal = items.reduce((total, item) => {
      if (selectedItems[item.id]) {
        return total + (item.price * item.quantity);
      }
      return total;
    }, 0);
    setSelectedSubtotal(newSubtotal);
  }, [selectedItems, items]);

  const handleQuantityChange = (id, newQty) => {
    if (newQty >= 1 && newQty <= 10) {
      updateQuantity(id, newQty);
    }
  };

  const toggleItemSelection = (id) => {
    setSelectedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleSelectAll = (isSelected) => {
    const newSelectedState = {};
    items.forEach(item => {
      newSelectedState[item.id] = isSelected;
    });
    setSelectedItems(newSelectedState);
  };

  // Check if all items are selected
  const areAllItemsSelected = items.length > 0 && items.every(item => selectedItems[item.id]);

  // Calculate order summary based on selected items
  const shipping = selectedSubtotal > 100 ? 0 : 15;
  const tax = selectedSubtotal * 0.08; // 8% tax
  const total = selectedSubtotal + shipping + tax;

  // Count selected items
  const selectedItemsCount = Object.values(selectedItems).filter(Boolean).length;

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
                        <Button
                          variant="outline"
                          size="icon"
                          className={`h-8 w-8 border-gray-300 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 ${!selectedItems[item.id] ? 'opacity-50' : ''}`}
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1 || !selectedItems[item.id]}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
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
                          className={`h-8 w-12 mx-2 text-center p-0 bg-white dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 ${!selectedItems[item.id] ? 'opacity-50' : ''}`}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className={`h-8 w-8 border-gray-300 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 ${!selectedItems[item.id] ? 'opacity-50' : ''}`}
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= 10 || !selectedItems[item.id]}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
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
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600 dark:text-green-400">Free</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
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
                  asChild 
                  className={`w-full mt-6 ${selectedItemsCount > 0 ? 'bg-yooboba-gradient hover:opacity-90 dark:shadow-glow-sm' : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'} transition-all duration-300`}
                  disabled={selectedItemsCount === 0}
                >
                  <Link to={selectedItemsCount > 0 ? "/checkout" : "#"} onClick={(e) => selectedItemsCount === 0 && e.preventDefault()}>
                    Proceed to Checkout {selectedItemsCount > 0 && `(${selectedItemsCount} ${selectedItemsCount === 1 ? 'item' : 'items'})`}
                  </Link>
                </Button>
                
                <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                  <p>Free shipping on orders over {formatPrice(100)}</p>
                  <p>Taxes calculated at checkout</p>
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