import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Customer } from '../models/CustomerModel'; // Import the Customer interface

interface AuthContextType {
  user: Customer | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, customer: Customer) => void;
  logout: () => void;
  updateUser: (customer: Customer) => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Customer | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from sessionStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = sessionStorage.getItem('token');
        const storedCustomer = sessionStorage.getItem('customer');
        
        if (storedToken && storedCustomer) {
          const customerData: Customer = JSON.parse(storedCustomer);
          setToken(storedToken);
          setUser(customerData);
        }
      } catch (error) {
        console.error('Error parsing stored auth data:', error);
        // Clear invalid data
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('customer');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = (newToken: string, customer: Customer) => {
    setToken(newToken);
    setUser(customer);
    sessionStorage.setItem('token', newToken);
    sessionStorage.setItem('customer', JSON.stringify(customer));
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('customer');
  };

  // Update user function
  const updateUser = (customer: Customer) => {
    setUser(customer);
    sessionStorage.setItem('customer', JSON.stringify(customer));
  };

  const isAuthenticated = !!token && !!user;

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Higher-order component for protected routes
interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback = <div>Please log in to access this page.</div> 
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};