
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { createOrder, Customer, Address } from "@/models/OrderModel";
import { toast } from "@/components/ui/use-toast";

const CheckoutPage = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Shipping information
  const [customer, setCustomer] = useState<Customer>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
  });

  // Address information
  const [shippingAddress, setShippingAddress] = useState<Address>({
    street1: "",
    street2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [billingAddress, setBillingAddress] = useState<Address>({
    street1: "",
    street2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  // Payment information
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  // Handle input changes for customer info
  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  // Handle input changes for shipping address
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
    if (sameAsBilling) {
      setBillingAddress((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle input changes for billing address
  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Handle toggle for same as shipping
  const handleSameAsShipping = () => {
    setSameAsBilling(!sameAsBilling);
    if (!sameAsBilling) {
      setBillingAddress({ ...shippingAddress });
    }
  };

  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  // Process the order
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Convert cart items to order items
    const orderItems = items.map((item) => ({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    // Create a new order
    try {
      // Simulate API call to create order
      const order = createOrder(
        customer,
        shippingAddress,
        sameAsBilling ? shippingAddress : billingAddress,
        orderItems,
        paymentMethod
      );

      // Simulate payment processing delay
      setTimeout(() => {
        // Clear the cart and show success message
        clearCart();
        toast({
          title: "Order Placed!",
          description: `Your order #${order.id} has been placed successfully.`,
        });
        navigate("/"); // Navigate to home page after successful order
        setLoading(false);
      }, 2000);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Redirect to cart if cart is empty
  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="mb-6">Add some products to your cart before proceeding to checkout.</p>
            <Button asChild>
              <a href="/products">Browse Products</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold font-display mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmitOrder}>
              {/* Customer Information */}
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={customer.firstName}
                      onChange={handleCustomerChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={customer.lastName}
                      onChange={handleCustomerChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={customer.email}
                      onChange={handleCustomerChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={customer.phone}
                      onChange={handleCustomerChange}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="company">Company (Optional)</Label>
                    <Input
                      id="company"
                      name="company"
                      value={customer.company}
                      onChange={handleCustomerChange}
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="street1">Street Address *</Label>
                    <Input
                      id="street1"
                      name="street1"
                      value={shippingAddress.street1}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="street2">Apartment, suite, etc. (optional)</Label>
                    <Input
                      id="street2"
                      name="street2"
                      value={shippingAddress.street2}
                      onChange={handleShippingChange}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State/Province *</Label>
                      <Input
                        id="state"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP/Postal Code *</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={shippingAddress.zipCode}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="sameAsBilling"
                    checked={sameAsBilling}
                    onChange={handleSameAsShipping}
                    className="mr-2"
                  />
                  <Label htmlFor="sameAsBilling">Same as shipping address</Label>
                </div>

                {!sameAsBilling && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="billing_street1">Street Address *</Label>
                      <Input
                        id="billing_street1"
                        name="street1"
                        value={billingAddress.street1}
                        onChange={handleBillingChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="billing_street2">
                        Apartment, suite, etc. (optional)
                      </Label>
                      <Input
                        id="billing_street2"
                        name="street2"
                        value={billingAddress.street2}
                        onChange={handleBillingChange}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="billing_city">City *</Label>
                        <Input
                          id="billing_city"
                          name="city"
                          value={billingAddress.city}
                          onChange={handleBillingChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="billing_state">State/Province *</Label>
                        <Input
                          id="billing_state"
                          name="state"
                          value={billingAddress.state}
                          onChange={handleBillingChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="billing_zipCode">ZIP/Postal Code *</Label>
                        <Input
                          id="billing_zipCode"
                          name="zipCode"
                          value={billingAddress.zipCode}
                          onChange={handleBillingChange}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="billing_country">Country *</Label>
                      <Input
                        id="billing_country"
                        name="country"
                        value={billingAddress.country}
                        onChange={handleBillingChange}
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <div className="space-y-4">
                  <div className="flex items-center mb-4">
                    <input
                      type="radio"
                      id="credit_card"
                      name="paymentMethod"
                      value="credit_card"
                      checked={paymentMethod === "credit_card"}
                      onChange={() => setPaymentMethod("credit_card")}
                      className="mr-2"
                    />
                    <Label htmlFor="credit_card">Credit Card</Label>
                  </div>

                  {paymentMethod === "credit_card" && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number *</Label>
                        <Input
                          id="cardNumber"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="cardExpiry">Expiry Date *</Label>
                          <Input
                            id="cardExpiry"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="cardCvc">CVC *</Label>
                          <Input
                            id="cardCvc"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="paypal"
                      name="paymentMethod"
                      value="paypal"
                      checked={paymentMethod === "paypal"}
                      onChange={() => setPaymentMethod("paypal")}
                      className="mr-2"
                    />
                    <Label htmlFor="paypal">PayPal</Label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-yooboba-gradient hover:opacity-90"
                size="lg"
                disabled={loading}
              >
                {loading ? "Processing..." : "Place Order"}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-20">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              {/* Order Items */}
              <div className="space-y-4 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden mr-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Order Totals */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
