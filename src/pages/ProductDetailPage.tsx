import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Product } from "@/models/ProductModel";
import { fetchProductById } from "@/services/productService";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, ArrowLeft, AlertTriangle } from "lucide-react";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScrollAnimation from "@/components/animations/ScrollAnimations";
import { useCurrency } from "@/context/CurrencyContext";
import BackToTopButton from "@/components/ui/back-to-top";
import { useAuth } from "@/context/AuthContext";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ProductDetailPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<{
    weight: string;
    price: number;
    stock: number;
  } | null>(null);
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const loadProduct = async () => {
      if (!productId) {
        setError("No product ID provided");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const productData = await fetchProductById(productId);
        setProduct(productData);
        
        // Set initial selected variant
        if (productData.variants && productData.variants.length > 0) {
          setSelectedVariant(productData.variants[0]);
        }
      } catch (err) {
        console.error(`Error fetching product with ID ${productId}:`, err);
        setError("Failed to load product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  // Update quantity when selected variant changes to ensure it's not more than stock
  useEffect(() => {
    if (selectedVariant && quantity > selectedVariant.stock) {
      setQuantity(Math.max(1, selectedVariant.stock));
    }
  }, [selectedVariant, quantity]);

  // Loading state
  if (loading) {
    return <LoadingSpinner/>;
  }

  // Error state or product not found
  if (error || !product) {
    return (
      <div className="flex flex-col min-h-screen dark:bg-gray-900 dark:text-white">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              {error || "Product Not Found"}
            </h1>
            <p className="mb-6">Sorry, we couldn't find the product you're looking for.</p>
            <Button asChild>
              <Link to="/products">Back to Products</Link>
            </Button>
          </div>
        </main>
        <Footer />
        <BackToTopButton />
      </div>
    );
  }

  const incrementQuantity = () => {
    console.log("Increment clicked");
    if (selectedVariant && quantity < Math.min(10, selectedVariant.stock)) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    console.log("Decrement clicked");
    setQuantity(prev => (prev > 1 ? prev - 1 : prev));
  };

  const handleWeightChange = (weight: string) => {
    const variant = product.variants.find(v => v.weight === weight);
    if (variant) {
      setSelectedVariant(variant);
      
      // Reset quantity if it exceeds the stock of new variant
      if (quantity > variant.stock) {
        setQuantity(Math.max(1, variant.stock));
      }
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    
    addItem({
      id: product.product_id,
      name: product.name,
      price: selectedVariant.price,
      quantity: quantity,
      image: product.imageUrls[0],
      weight: selectedVariant.weight
    });
  };

  const isLowStock = selectedVariant && selectedVariant.stock <= 10;
  const isOutOfStock = selectedVariant && selectedVariant.stock === 0;

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900 dark:text-white">
      <Navbar />

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <Link 
            to="/products" 
            className="inline-flex items-center text-yooboba-purple dark:text-yooboba-light mb-6 hover:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Product Image */}
            <ScrollAnimation animation="animate-zoom-in" delay={200}>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 flex items-center justify-center">
                <img
                  src={product.imageUrls[0]}
                  alt={product.name}
                  className="max-h-[500px] object-cover rounded-lg transition-transform duration-500 hover:scale-110"
                />
              </div>
            </ScrollAnimation>

            {/* Product Details */}
            <ScrollAnimation animation="animate-reveal-text" delay={400}>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold font-display">{product.name}</h1>
              </div>
              
              {selectedVariant && (
                <div className="mt-4">
                  <span className="text-2xl font-bold">{formatPrice(selectedVariant.price)}</span>
                  <span className="ml-2 text-gray-500 dark:text-gray-400">/ {selectedVariant.weight}</span>
                </div>
              )}

              <p className="mt-6 text-gray-700 dark:text-gray-300">{product.description}</p>

              <div className="mt-8 space-y-6">
                {/* Weight Selection */}
                <div>
                  <p className="font-medium mb-2">Size Options</p>
                  <Select 
                    value={selectedVariant?.weight} 
                    onValueChange={handleWeightChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select weight" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.variants.map((variant) => (
                        <SelectItem 
                          key={variant.weight} 
                          value={variant.weight}
                          disabled={variant.stock === 0}
                        >
                          {variant.weight} - {formatPrice(variant.price)}
                          {variant.stock === 0 && " (Out of Stock)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Stock Status */}
                {isLowStock && !isOutOfStock && (
                  <div>
                    <p className="text-sm flex items-center text-amber-600 dark:text-amber-400">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Only {selectedVariant.stock} left in stock
                    </p>
                  </div>
                )}

                {isOutOfStock && (
                  <Alert variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      This size is currently out of stock. Please select a different size or check back later.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Quantity Selector */}
                <div>
                  <p className="font-medium mb-2">Quantity</p>
                  <div className="flex items-center">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={decrementQuantity}
                      disabled={quantity <= 1 || isOutOfStock}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="mx-4 w-8 text-center font-medium">{quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={incrementQuantity}
                      disabled={
                        isOutOfStock || 
                        (selectedVariant && quantity >= Math.min(10, selectedVariant.stock))
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button 
                  className="w-full bg-yooboba-gradient hover:opacity-90" 
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </Button>
              </div>

              <div className="mt-8">
                <Separator className="dark:bg-gray-700" />
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Weight</p>
                    <p className="font-medium">{selectedVariant?.weight || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                    <p className="font-medium capitalize">{product.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Texture</p>
                    <p className="font-medium">{product.details.texture}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Flavor</p>
                    <p className="font-medium">{product.details.flavor}</p>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>

          {/* Product Tabs */}
          <ScrollAnimation animation="animate-zoom-in" delay={600} className="mt-16">
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="instructions">Instructions</TabsTrigger>
                <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                <p>{product.description}</p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Color</h4>
                    <p>{product.details.color}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Texture</h4>
                    <p>{product.details.texture}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Flavor</h4>
                    <p>{product.details.flavor}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Available Sizes</h4>
                    <p>{product.variants.map(v => v.weight).join(", ")}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="instructions" className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Cooking Instructions</h3>
                <p className="mb-4">
                  <strong>Cooking Time:</strong> {product.details.cookingTime}
                </p>
                <p className="mb-4">
                  <strong>Storage:</strong> {product.details.storageInstructions}
                </p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Bring water to a boil in a large pot.</li>
                  <li>Add boba pearls to the boiling water and stir gently.</li>
                  <li>Once pearls float to the surface, reduce heat to medium and cover with lid.</li>
                  <li>Cook according to package instructions (usually 20-30 minutes).</li>
                  <li>When pearls are soft all the way through, drain and rinse with cold water.</li>
                  <li>Soak in simple syrup or honey for added flavor.</li>
                </ol>
              </TabsContent>
              <TabsContent value="ingredients" className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Ingredients</h3>
                <ul className="list-disc list-inside">
                  {product.details.ingredients?.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </TabsContent>
            </Tabs>
          </ScrollAnimation>
        </div>
      </main>
      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default ProductDetailPage;