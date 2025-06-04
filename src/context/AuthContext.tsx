import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import { loginCustomer } from "@/services/customerService";

interface User {
  id: string;
  name: string;
  email: string;
  // Add other user properties as needed
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedCustomer = localStorage.getItem("customer");

    if (storedToken && storedCustomer) {
      try {
        const customerData = JSON.parse(storedCustomer);
        setToken(storedToken);
        setUser(customerData);
      } catch (error) {
        // If parsing fails, clear the invalid data
        localStorage.removeItem("token");
        localStorage.removeItem("customer");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await loginCustomer(email, password);
      
      // Save token and customer data
      localStorage.setItem("token", response.token);
      localStorage.setItem("customer", JSON.stringify(response.customer));
      
      setToken(response.token);
      setUser(response.customer);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("customer");
    setToken(null);
    setUser(null);
  };

  const contextValue = useMemo(() => ({
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    logout,
  }), [user, token, isLoading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};