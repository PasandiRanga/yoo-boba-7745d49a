import { useState } from "react";
import { ArrowLeft } from "lucide-react";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
    // Redirect to home or dashboard after successful signup
  };

  const goBack = () => {
    window.location.href = "/";

    // Navigation logic to go back
    console.log("Navigating back to home");
  };

  const goToLogin = () => {
    // Navigation logic to go to login page
    console.log("Navigating to login page");
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
                src="/public/images/LogoWithBack.png"
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
          <p className="opacity-80">© 2025 BrandName. All rights reserved.</p>
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
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input 
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Enter your full name"
              />
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
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Enter your contact number"
              />
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
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Enter your email"
              />
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
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Enter your address"
              />
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
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Create a password"
              />
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
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Confirm your password"
              />
            </div>
            
            <button
              onClick={handleSubmit}
              className="w-full py-3 px-4 mt-6 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-medium rounded-lg transition-colors focus:ring-4 focus:ring-purple-300"
            >
              Create Account
            </button>
          </div>
          
          
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;