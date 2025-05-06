import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "@/models/ProductModel";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScrollAnimation from "@/components/animations/ScrollAnimations";
import { useCurrency } from "@/context/CurrencyContext";

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  
  const product = productId ? getProductById(productId) : null;

  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen dark:bg-gray-900 dark:text-white">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="mb-6">Sorry, we couldn't find the product you're looking for.</p>
            <Button asChild>
              <Link to="/products">Back to Products</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const incrementQuantity = () => {
    setQuantity(prev => (prev < 10 ? prev + 1 : prev));
  };

  const decrementQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : prev));
  };

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images[0],
      weight: product.weight
    });
  };

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
                  src={product.images[0]}
                  alt={product.name}
                  className="max-h-[500px] object-cover rounded-lg transition-transform duration-500 hover:scale-110"
                />
              </div>
            </ScrollAnimation>

            {/* Product Details */}
            <ScrollAnimation animation="animate-reveal-text" delay={400}>
              <h1 className="text-3xl md:text-4xl font-bold font-display">{product.name}</h1>
              <div className="mt-4">
                <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
                <span className="ml-2 text-gray-500 dark:text-gray-400">/ {product.weight}</span>
              </div>

              <p className="mt-6 text-gray-700 dark:text-gray-300">{product.description}</p>

              <div className="mt-8 space-y-6">
                <div>
                  <p className="font-medium mb-2">Quantity</p>
                  <div className="flex items-center">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="mx-4 w-8 text-center font-medium">{quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={incrementQuantity}
                      disabled={quantity >= 10}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button 
                  className="w-full bg-yooboba-gradient hover:opacity-90" 
                  size="lg"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
              </div>

              <div className="mt-8">
                <Separator className="dark:bg-gray-700" />
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Weight</p>
                    <p className="font-medium">{product.weight}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                    <p className="font-medium capitalize">{product.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Texture</p>
                    <p className="font-medium">{product.attributes.texture}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Flavor</p>
                    <p className="font-medium">{product.attributes.flavor}</p>
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
                    <p>{product.attributes.color}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Texture</h4>
                    <p>{product.attributes.texture}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Flavor</h4>
                    <p>{product.attributes.flavor}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Weight</h4>
                    <p>{product.weight}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="instructions" className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Cooking Instructions</h3>
                <p className="mb-4">
                  <strong>Cooking Time:</strong> {product.attributes.cookingTime}
                </p>
                <p className="mb-4">
                  <strong>Storage:</strong> {product.attributes.storageInstructions}
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
                  {product.attributes.ingredients?.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </TabsContent>
            </Tabs>
          </ScrollAnimation>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
