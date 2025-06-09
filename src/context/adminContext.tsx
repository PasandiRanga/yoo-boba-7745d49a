import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Admin {
  id: number;
  name: string;
  email: string;
  address?: string;
}

interface AdminContextType {
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, admin: Admin) => void;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize admin state from sessionStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = sessionStorage.getItem('adminToken');
        const storedAdmin = sessionStorage.getItem('adminData');
        
        if (storedToken && storedAdmin) {
          const adminData: Admin = JSON.parse(storedAdmin);
          setToken(storedToken);
          setAdmin(adminData);
        }
      } catch (error) {
        console.error('Error parsing stored admin auth data:', error);
        sessionStorage.removeItem('adminToken');
        sessionStorage.removeItem('adminData');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (newToken: string, adminData: Admin) => {
    setToken(newToken);
    setAdmin(adminData);
    sessionStorage.setItem('adminToken', newToken);
    sessionStorage.setItem('adminData', JSON.stringify(adminData));
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminData');
    window.location.href = '/admin/login';
  };

  const isAuthenticated = !!token && !!admin;

  const value: AdminContextType = {
    admin,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ 
  children, 
  fallback = <div>Access denied. Please log in as admin.</div> 
}) => {
  const { isAuthenticated, isLoading } = useAdmin();

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