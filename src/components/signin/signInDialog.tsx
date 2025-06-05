import { useState } from "react";
import { Button } from "@/components/ui/button";
import { User, AlertCircle } from "lucide-react";
import { loginCustomer } from "@/services/customerService";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/authContext';

// StyledInput component with proper TypeScript types
interface StyledInputProps {
  type?: string;
  name: string;
  id: string;
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const StyledInput: React.FC<StyledInputProps> = ({
  type = "text",
  name,
  id,
  placeholder,
  value: initialValue = "",
  onChange,
  required = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState(initialValue);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (onChange) onChange(e);
  };
  
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  
  return (
    <div className="w-full">
      <input
        type={type}
        name={name}
        id={id}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        required={required}
        autoComplete="off"
        placeholder={placeholder}
        className={`
          w-full border-none outline-none rounded-2xl p-2.5 text-base
          transition-all duration-300 ease-in-out
          ${isFocused ? 'transform scale-105' : ''}
          
          /* Light mode */
          bg-white text-gray-700
          ${isFocused
             ? 'shadow-lg'
             : 'shadow-inner shadow-gray-200 bg-gray-100'}
          
          /* Dark mode */
          dark:text-white
          ${isFocused
             ? 'dark:bg-gray-700 dark:shadow-gray-900'
             : 'dark:bg-gray-800 dark:shadow-gray-900'}
        `}
      />
    </div>
  );
};

const SignInDialog: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  // Add validation errors state
  const [errors, setErrors] = useState({
    email: "",
    password: ""
  });
  
  // Add states for loading and general error message
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing in a field
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
    
    // Also clear general error when user makes changes
    if (generalError) {
      setGeneralError("");
    }
  };
  
  // Add form validation function
  const validateForm = (): boolean => {
    const newErrors = { email: "", password: "" };
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginCustomer(formData.email, formData.password);
      
      // Use the login function from AuthContext - this will automatically trigger cart sync
      login(response.token, response.customer);

      // Close the dialog and navigate to home page
      setIsOpen(false);
      navigate('/');
      
    } catch (error: unknown) {
      // Handle specific error messages from the backend
      if (typeof error === "object" && error !== null && "message" in error && typeof (error as { message: unknown }).message === "string") {
        const message = (error as { message: string }).message;
        if (message.includes('401')) {
          setGeneralError("Invalid email or password. Please try again.");
        } else if (message.includes('500')) {
          setGeneralError("Server error. Please try again later.");
        } else {
          setGeneralError(message || "Authentication failed. Please try again.");
        }
      } else {
        setGeneralError("Authentication failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToSignUp = () => {
    navigate('/signUp');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <User className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      </Button>
      
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl transform transition-all max-w-md w-full p-6 overflow-hidden">
            <div className="space-y-4">
              <h2 className="text-center text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Login
              </h2>
              
              {/* General error message */}
              {generalError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg flex items-start">
                  <AlertCircle className="mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>{generalError}</span>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col space-y-1">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <div className="flex items-center gap-2 px-2 py-1">
                    <svg className="h-5 w-5 text-purple-600 dark:text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z" />
                    </svg>
                    <StyledInput
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
                
                <div className="flex flex-col space-y-1 mt-4">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <div className="flex items-center gap-2 px-2 py-1">
                    <svg className="h-5 w-5 text-purple-600 dark:text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                    </svg>
                    <StyledInput
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                  )}
                </div>
                
                <div className="mt-6">
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-500 dark:from-blue-500 dark:to-pink-500 text-white font-medium py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-105 disabled:opacity-70"
                  >
                    {isLoading ? 'Logging in...' : 'Login'}
                  </button>
                </div>
              </form>
              
              <button 
                type="button" 
                className="w-full text-center text-purple-600 dark:text-blue-500 hover:text-pink-500 dark:hover:text-pink-500 mt-4 transition-transform hover:scale-105"
              >
                Forgot Password
              </button>
              
              <div className="text-center text-gray-600 dark:text-gray-300 text-sm mt-4">
                Don't have an account? 
                <button 
                  type="button" 
                  onClick={navigateToSignUp} 
                  className="ml-1 text-purple-600 dark:text-blue-500 hover:text-pink-500 dark:hover:text-pink-500 font-medium underline"
                >
                  Sign Up
                </button>
              </div>
              
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignInDialog;