import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SelectItem } from "@/components/ui/select";
import BackToTopButton from "@/components/ui/back-to-top";
import FloatingBubbles from "@/components/animations/floatingBubbles";
import StyledInput from "@/components/ui/styledInput";
import StyledTextarea from "@/components/ui/styledTextArea";
import StyledSelect from "@/components/ui/styledSelect";
import { Product } from "@/models/ProductModel";
import { fetchProducts, fetchProductById } from "@/services/productService";


const BYOBPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    organizationName: "",
    category: "",
    contactNumber: "",
    email: "",
    address: "",
    productType: "",
    weight: "",
    maximumQuantity: ""
  });

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [availableWeights, setAvailableWeights] = useState<string[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // Fetch products on component mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setProductsLoading(true);
        const productsData = await fetchProducts();
        setProducts(productsData);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select change for category, weight, etc.
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductTypeChange = async (productId: string) => {
    // Optionally, fetch the latest product data by ID
    let product = products.find(p => p.product_id === productId);
    
    product = await fetchProductById(productId);
  
    setSelectedProduct(product || null);

    if (product && product.variants && Array.isArray(product.variants)) {
      const weights = product.variants.map(variant => variant.weight);
      console.log("Weights" , weights);
      setAvailableWeights(weights);
      setFormData(prev => ({
        ...prev,
        productType: productId,
        weight: "",
        maximumQuantity: ""
      }));
    } else {
      setAvailableWeights([]);
      setFormData(prev => ({
        ...prev,
        productType: productId,
        weight: "",
        maximumQuantity: ""
      }));
    }
  };

  console.log(formData);

// Get max quantity for selected weight
  const getMaxQuantityForWeight = (weight: string): number => {
    if (!selectedProduct || !selectedProduct.variants || !Array.isArray(selectedProduct.variants)) {
      return 0;
    }
    const variant = selectedProduct.variants.find(v => v.weight === weight);
    return variant ? variant.stock : 0;
  };

  const handleWeightChange = (weight: string) => {
    setFormData(prev => ({
      ...prev,
      weight,
      maximumQuantity: ""
    }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Get product name for the form data
    const productName = selectedProduct ? selectedProduct.name : "";
    const maxAvailable = formData.weight ? getMaxQuantityForWeight(formData.weight) : 0;
    
    const submissionData = {
      ...formData,
      productName,
      maxAvailableStock: maxAvailable
    };
    
    // Simulate form submission
    setTimeout(() => {
      console.log("Form submitted:", submissionData);
      setLoading(false);
      
      // Reset form after submission
      setFormData({
        name: "",
        organizationName: "",
        category: "",
        contactNumber: "",
        email: "",
        address: "",
        productType: "",
        weight: "",
        maximumQuantity: ""
      });
      setSelectedProduct(null);
      setAvailableWeights([]);
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section with Floating Bubbles */}
        <section className="bg-gradient-to-r from-yooboba-blue/10 via-yooboba-purple/10 to-yooboba-pink/10 dark:from-yooboba-blue/20 dark:via-yooboba-purple/20 dark:to-yooboba-pink/20 py-16 md:py-24 relative overflow-hidden">
          <FloatingBubbles />
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold font-display mb-6 dark:text-white">
                Build Your Own Brand
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                Elevate Your Business with Premium Boba Supplies
              </p>
            </div>
          </div>
        </section>

        {/* Form & Information Section */}
        <section className="py-16 dark:bg-gray-900/60">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700">
                <h2 className="text-2xl font-bold font-display mb-6 dark:text-white">Request Wholesale Information</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="dark:text-gray-300 mb-2 block">Full Name *</Label>
                      <StyledInput
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="organizationName" className="dark:text-gray-300 mb-2 block">Organization Name *</Label>
                      <StyledInput
                        id="organizationName"
                        name="organizationName"
                        value={formData.organizationName}
                        onChange={handleChange}
                        required
                        placeholder="Your Business Name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="category" className="dark:text-gray-300 mb-2 block">Business Category *</Label>
                      <StyledSelect
                        id="category"
                        name="category"
                        value={formData.category}
                        onValueChange={(value) => handleSelectChange("category", value)}
                        placeholder="Select category"
                        required
                      >
                        <SelectItem value="cafe">Cafe</SelectItem>
                        <SelectItem value="hotel">Hotel</SelectItem>
                        <SelectItem value="restaurant">Restaurant</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="miniBar">Mini Bar</SelectItem>
                        <SelectItem value="catering">Catering</SelectItem>
                      </StyledSelect>
                    </div>
                    <div>
                      <Label htmlFor="contactNumber" className="dark:text-gray-300 mb-2 block">Contact Number *</Label>
                      <StyledInput
                        id="contactNumber"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        required
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email" className="dark:text-gray-300 mb-2 block">Email Address *</Label>
                    <StyledInput
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address" className="dark:text-gray-300 mb-2 block">Business Address *</Label>
                    <StyledTextarea
                      id="address"
                      name="address"
                      rows={3}
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="Enter your business address..."
                    />
                  </div>
                  {/* Product Selection Section */}
                  <div className="border-t dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold mb-4 dark:text-white">Product Requirements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="productType" className="dark:text-gray-300 mb-2 block">Product Type *</Label>
                        <StyledSelect
                          id="productType"
                          name="productType"
                          value={formData.productType}
                          onValueChange={handleProductTypeChange}
                          placeholder={productsLoading ? "Loading products..." : "Select product type"}
                          required
                          disabled={productsLoading}
                        >
                          {products.map((product) => (
                            <SelectItem key={product.product_id} value={product.product_id}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </StyledSelect>
                      </div>
                      <div>
                        <Label htmlFor="weight" className="dark:text-gray-300 mb-2 block">Weight/Size *</Label>
                        <StyledSelect
                          id="weight"
                          name="weight"
                          value={formData.weight}
                          onValueChange={handleWeightChange}
                          placeholder="Select weight"
                          required
                          disabled={!selectedProduct || availableWeights.length === 0}
                        >
                          {availableWeights.map((weight) => (
                            <SelectItem key={weight} value={weight}>
                              {weight}
                            </SelectItem>
                          ))}
                        </StyledSelect>
                      </div>
                    </div>
                    <div className="mt-6">
                      <Label htmlFor="maximumQuantity" className="dark:text-gray-300 mb-2 block">
                        Maximum Quantity Required *
                        
                      </Label>
                      <StyledInput
                        id="maximumQuantity"
                        name="maximumQuantity"
                        type="number"
                        min="1"
                        max={formData.weight ? getMaxQuantityForWeight(formData.weight) : undefined}
                        value={formData.maximumQuantity}
                        onChange={handleChange}
                        required
                        placeholder="Enter maximum quantity needed"
                        disabled={!formData.weight}
                      />
                      
                    </div>
                  </div>
                  <Button
                    type="submit"
                    variant="sendMessage"
                    className="w-full"
                    size="xl"
                    disabled={loading}
                    isLoading={loading}
                  >
                    Send Request
                  </Button>
                </form>
              </div>

              {/* Information Card */}
              <div>
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm dark:shadow-gray-900/30 mb-8 border border-gray-100 dark:border-gray-700">
                  <h2 className="text-2xl font-bold font-display mb-6 dark:text-white">Partnership Benefits</h2>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-yooboba-light dark:bg-gray-700 rounded-full p-3 mr-4 text-yooboba-purple dark:text-pink-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1 dark:text-white">Premium Quality Products</h3>
                        <p className="text-gray-600 dark:text-gray-400">Authentic tapioca pearls and popping boba with superior taste and texture</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-yooboba-light dark:bg-gray-700 rounded-full p-3 mr-4 text-yooboba-purple dark:text-pink-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1 dark:text-white">Competitive Pricing</h3>
                        <p className="text-gray-600 dark:text-gray-400">Wholesale rates that help maximize your profit margins</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-yooboba-light dark:bg-gray-700 rounded-full p-3 mr-4 text-yooboba-purple dark:text-pink-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1 dark:text-white">Custom Branding</h3>
                        <p className="text-gray-600 dark:text-gray-400">Create your unique identity with customized packaging options</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-yooboba-light dark:bg-gray-700 rounded-full p-3 mr-4 text-yooboba-purple dark:text-pink-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1 dark:text-white">Training & Support</h3>
                        <p className="text-gray-600 dark:text-gray-400">Comprehensive training materials and ongoing support for your team</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-yooboba-light dark:bg-gray-700 rounded-full p-3 mr-4 text-yooboba-purple dark:text-pink-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1 dark:text-white">Reliable Supply Chain</h3>
                        <p className="text-gray-600 dark:text-gray-400">Consistent delivery and supply to ensure your business runs smoothly</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700">
                  <h2 className="text-2xl font-bold font-display mb-6 dark:text-white">Perfect For</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex flex-col items-center p-4 bg-yooboba-light/50 dark:bg-gray-700/50 rounded-lg text-center">
                      <div className="mb-3 text-yooboba-purple dark:text-pink-400">
                        <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                        </svg>
                      </div>
                      <span className="font-medium dark:text-white">Cafes</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-yooboba-light/50 dark:bg-gray-700/50 rounded-lg text-center">
                      <div className="mb-3 text-yooboba-purple dark:text-pink-400">
                        <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                      </div>
                      <span className="font-medium dark:text-white">Hotels</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-yooboba-light/50 dark:bg-gray-700/50 rounded-lg text-center">
                      <div className="mb-3 text-yooboba-purple dark:text-pink-400">
                        <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path>
                        </svg>
                      </div>
                      <span className="font-medium dark:text-white">Restaurants</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-yooboba-light/50 dark:bg-gray-700/50 rounded-lg text-center">
                      <div className="mb-3 text-yooboba-purple dark:text-pink-400">
                        <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002 2V8m-9 4h4"></path>
                        </svg>
                      </div>
                      <span className="font-medium dark:text-white">Mini Bars</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-yooboba-light/50 dark:bg-gray-700/50 rounded-lg text-center">
                      <div className="mb-3 text-yooboba-purple dark:text-pink-400">
                        <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 22V12h6v10"></path>
                        </svg>
                      </div>
                      <span className="font-medium dark:text-white">Villas</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-yooboba-light/50 dark:bg-gray-700/50 rounded-lg text-center">
                      <div className="mb-3 text-yooboba-purple dark:text-pink-400">
                        <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                      </div>
                      <span className="font-medium dark:text-white">Catering</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default BYOBPage;