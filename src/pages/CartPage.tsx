import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Trash, Plus, Minus } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

const CartPage = () => {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();
  const { formatPrice } = useCurrency();

  const handleQuantityChange = (id: string, newQty: number) => {
    if (newQty >= 1 && newQty <= 10) {
      updateQuantity(id, newQty);
    }
  };

  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

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
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-center">Subtotal</div>
                </div>

                {items.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 md:grid-cols-12 p-4 border-b dark:border-gray-700 items-center gap-4 md:gap-0"
                  >
                    <div className="col-span-6 flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded dark:brightness-95"
                      />
                      <div>
                        <Link
                          to={`/products/${item.id}`}
                          className="font-medium hover:text-yooboba-purple dark:text-white dark:hover:text-yooboba-blue"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.weight}</p>
                      </div>
                    </div>

                    <div className="col-span-2 text-center text-gray-900 dark:text-gray-300">
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
                          className="h-8 w-8 border-gray-300 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
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
                          className="h-8 w-12 mx-2 text-center p-0 bg-white dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-gray-300 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= 10}
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
                        <span className="font-medium text-gray-900 dark:text-gray-300">
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
                
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-900 dark:text-gray-300">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
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
                  className="w-full mt-6 bg-yooboba-gradient hover:opacity-90 dark:shadow-glow-sm transition-all duration-300"
                >
                  <Link to="/checkout">
                    Proceed to Checkout
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