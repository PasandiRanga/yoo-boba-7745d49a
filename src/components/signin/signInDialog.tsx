import { useState } from "react";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

// Import the StyledInput component
const StyledInput = ({
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
  
  const handleChange = (e) => {
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

const SignInDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    console.log("Form submitted:", formData);
  };

  const navigateToSignUp = () => {
    // Navigate to signUp.tsx in the same folder
    window.location.href = "./signUp";
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
              
              <div className="mt-6">
                <button 
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 dark:from-blue-500 dark:to-pink-500 text-white font-medium py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-105"
                >
                  Login
                </button>
              </div>
              
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