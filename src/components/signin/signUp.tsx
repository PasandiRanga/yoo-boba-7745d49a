import { useState } from "react";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Customer } from "@/models/CustomerModel";
import { createCustomer } from "@/services/customerService";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    contactNumber: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: ""
  });

  interface FormErrors {
    first_name?: string;
    last_name?: string;
    contactNumber?: string;
    email?: string;
    address?: string;
    password?: string;
    confirmPassword?: string;
  }
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing in a field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    // Name validation
    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }

    // Contact validation
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!/^\d{10}$/.test(formData.contactNumber.replace(/\D/g, ''))) {
      newErrors.contactNumber = "Please enter a valid contact number";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      // Prepare data for API using our customer model
      const customerData = {
        FullName: `${formData.first_name} ${formData.last_name}`,
        ContactNo: formData.contactNumber,
        EmailAddress: formData.email,
        Address: formData.address,
        Password: formData.password
      } as Omit<Customer, 'id'>;

      // Use the customerService instead of direct fetch
      await createCustomer(customerData);

      // Success! Redirect to home page
      window.location.href = "/";
      
    } catch (error) {
      // Handle specific error responses
      if (error.message?.includes("409")) {
        // Handle duplicate email or phone
        if (error.message.includes("email")) {
          setErrors(prev => ({ ...prev, email: "This email is already registered" }));
        }
        if (error.message.includes("phone")) {
          setErrors(prev => ({ ...prev, contactNumber: "This phone number is already registered" }));
        }
      } else if (!errors.email && !errors.contactNumber) {
        setGeneralError(error.message || "Failed to create account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    window.location.href = "/";
  };

  const goToLogin = () => {
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900">
      {/* Left Section - Branding */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-between bg-gradient-to-br from-purple-600 to-pink-500 p-8 text-white">
        <div>
          <button 
            onClick={goBack}
            className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </button>
          
          <div className="mt-16">
            {/* Company Logo */}
            <div className="flex items-center gap-3 mb-12">
            <img
                src="/images/LogoWithBack.png"
                alt="YooBoba Logo" 
                className="h-12 w-12 mr-2 group-hover:scale-105 transition-transform"
              />
              <h1 className="text-3xl font-bold">Yoo Boba</h1>
            </div>
            
            {/* Slogan */}
            <h2 className="text-4xl font-bold mb-6">Join our community today</h2>
            <p className="text-xl opacity-90 max-w-md">
              Create an account and start enjoying all the benefits our platform has to offer.
            </p>
          </div>
        </div>
        
        <div className="mb-8">
          <p className="opacity-80">© 2025 Yoo Boba. All rights reserved.</p>
        </div>
      </div>
      
      {/* Right Section - Form */}
      <div className="w-full md:w-1/2 p-6 md:p-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Mobile-only back button */}
          <button 
            onClick={goBack}
            className="flex md:hidden items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </button>
          
          <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Create Account</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Fill in the details below to get started
          </p>
          
          {generalError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg flex items-start">
              <AlertCircle className="mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
              <span>{generalError}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name
                </label>
                <input 
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  type="text"
                  className={`w-full px-4 py-2 border ${errors.first_name ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                  placeholder="First name"
                />
                {errors.first_name && (
                  <p className="mt-1 text-sm text-red-500">{errors.first_name}</p>
                )}
              </div>
              <div className="flex-1">
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name
                </label>
                <input 
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  type="text"
                  className={`w-full px-4 py-2 border ${errors.last_name ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                  placeholder="Last name"
                />
                {errors.last_name && (
                  <p className="mt-1 text-sm text-red-500">{errors.last_name}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contact Number
              </label>
              <input 
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                type="tel"
                className={`w-full px-4 py-2 border ${errors.contactNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                placeholder="Enter your contact number"
              />
              {errors.contactNumber && (
                <p className="mt-1 text-sm text-red-500">{errors.contactNumber}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input 
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Address
              </label>
              <input 
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                type="text"
                className={`w-full px-4 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                placeholder="Enter your address"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">{errors.address}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input 
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                className={`w-full px-4 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                placeholder="Create a password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password
              </label>
              <input 
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                type="password"
                className={`w-full px-4 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 mt-6 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-medium rounded-lg transition-colors focus:ring-4 focus:ring-purple-300 disabled:opacity-70"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <button 
                onClick={goToLogin}
                className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
              >
                Log in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;