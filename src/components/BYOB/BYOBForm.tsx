import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SelectItem } from "@/components/ui/select";
import StyledInput from "@/components/ui/styledInput";
import StyledTextarea from "@/components/ui/styledTextArea";
import StyledSelect from "@/components/ui/styledSelect";
import { Product } from "@/models/ProductModel";
import { fetchProducts, fetchProductById } from "@/services/productService";
import { submitBYOBRequest } from "@/services/byobService";
import { useAuth } from '@/context/authContext';
import { useToast } from '@/components/BYOB/BYOBAToast';
import { CheckCircle, RefreshCw } from 'lucide-react';

interface BYOBFormProps {
  onSuccess?: () => void;
}

const BYOBForm: React.FC<BYOBFormProps> = ({ onSuccess }) => {
  const initialFormState = {
    name: "",
    organizationName: "",
    category: "",
    contactNumber: "",
    email: "",
    address: "",
    productType: "",
    weight: "",
    maximumQuantity: ""
  };

  const [formData, setFormData] = useState(initialFormState);
  const { isAuthenticated, token } = useAuth();
  const { showToast, ToastContainer } = useToast();

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [availableWeights, setAvailableWeights] = useState<string[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [isSubmissionSuccess, setIsSubmissionSuccess] = useState(false); // New state for success message

  // Add useEffect to monitor formData changes
  useEffect(() => {
    console.log("Form data state updated:", formData);
  }, [formData]);

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

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductTypeChange = async (productId: string) => {
    let product = products.find(p => p.product_id === productId);
    product = await fetchProductById(productId);
    setSelectedProduct(product || null);

    if (product && product.variants && Array.isArray(product.variants)) {
      const weights = product.variants.map(variant => variant.weight);
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

  // Function to reset form and show form again
  const resetForm = () => {
    console.log("Resetting form...");
    
    // Reset all form data to initial state
    setFormData({ ...initialFormState });
    
    // Reset product-related state
    setSelectedProduct(null);
    setAvailableWeights([]);
    
    // Reset success state to show form again
    setIsSubmissionSuccess(false);
    
    setTimeout(() => {
      console.log("Form reset complete - Current form data:", formData);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log("=== FORM SUBMISSION START ===");
    console.log("Before submission - Form data:", formData);

    try {
      const productName = selectedProduct ? selectedProduct.name : "";
      
      const submissionData = {
        ...formData,
        productName
      };
      
      console.log("Submitting data:", submissionData);
      
      // Make the API call
      const result = await submitBYOBRequest(
        submissionData, 
        isAuthenticated ? token : undefined
      );
      
      console.log("API Response:", result);
      console.log("Submission successful, showing success message...");

      // Show success state instead of resetting form
      setIsSubmissionSuccess(true);

      // Show success toast with boba animation
      showToast("We received your inquiry and will get back to you soon", "success");

      // Call the success callback
      if (onSuccess) {
        console.log("Calling onSuccess callback");
        onSuccess();
      }

      console.log("=== FORM SUBMISSION SUCCESS ===");

    } catch (error) {
      console.error("=== FORM SUBMISSION ERROR ===");
      console.error("Submission failed:", error);
      console.error("Error details:", {
        message: error?.message,
        status: error?.status,
        response: error?.response
      });
      
      // Show error toast
      showToast("Failed to submit request. Please try again.", "error");
      
    } finally {
      setLoading(false);
      console.log("=== FORM SUBMISSION END ===");
    }
  };

  // Success message component
  if (isSubmissionSuccess) {
    return (
      <>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700">
          <div className="text-center py-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
                <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold font-display mb-4 text-gray-900 dark:text-white">
              Thank You for Your Inquiry!
            </h2>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              We received your inquiry and will get back to you soon with wholesale pricing and details.
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                <strong>What's next?</strong> Our wholesale team will review your request and contact you within 24-48 hours with customized pricing and availability information.
              </p>
            </div>
            
            <Button
              onClick={resetForm}
              variant="outline"
              className="inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Submit Another Request
            </Button>
          </div>
        </div>
        
        {/* Toast Container */}
        <ToastContainer />
      </>
    );
  }

  // Original form component
  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold font-display mb-6 dark:text-white">
          Request Wholesale Information
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name" className="dark:text-gray-300 mb-2 block">
                Full Name *
              </Label>
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
              <Label htmlFor="organizationName" className="dark:text-gray-300 mb-2 block">
                Organization Name *
              </Label>
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
              <Label htmlFor="category" className="dark:text-gray-300 mb-2 block">
                Business Category *
              </Label>
              <StyledSelect
                id="category"
                name="category"
                value={formData.category}
                onValueChange={(value) => handleSelectChange("category", value)}
                placeholder="Select category"
                required
                key={`category-${formData.category}`}
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
              <Label htmlFor="contactNumber" className="dark:text-gray-300 mb-2 block">
                Contact Number *
              </Label>
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
            <Label htmlFor="email" className="dark:text-gray-300 mb-2 block">
              Email Address *
            </Label>
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
            <Label htmlFor="address" className="dark:text-gray-300 mb-2 block">
              Business Address *
            </Label>
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
            <h3 className="text-lg font-semibold mb-4 dark:text-white">
              Product Requirements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="productType" className="dark:text-gray-300 mb-2 block">
                  Product Type *
                </Label>
                <StyledSelect
                  id="productType"
                  name="productType"
                  value={formData.productType}
                  onValueChange={handleProductTypeChange}
                  placeholder={productsLoading ? "Loading products..." : "Select product type"}
                  required
                  disabled={productsLoading}
                  key={`productType-${formData.productType}`}
                >
                  {products.map((product) => (
                    <SelectItem key={product.product_id} value={product.product_id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </StyledSelect>
              </div>
              <div>
                <Label htmlFor="weight" className="dark:text-gray-300 mb-2 block">
                  Weight/Size *
                </Label>
                <StyledSelect
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onValueChange={handleWeightChange}
                  placeholder="Select weight"
                  required
                  disabled={!selectedProduct || availableWeights.length === 0}
                  key={`weight-${formData.weight}-${availableWeights.join(',')}`}
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
      
      {/* Toast Container */}
      <ToastContainer />
    </>
  );
};

export default BYOBForm;