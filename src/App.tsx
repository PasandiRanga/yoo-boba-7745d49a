import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeProvider";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { LoadingProvider } from "@/context/LoadingContext";
import { AuthProvider } from "@/context/authContext";
import { AdminProvider, AdminProtectedRoute } from "@/context/adminContext";
import LoadingSpinner from "@/components/ui/loading-spinner";
import SignUp from "@/components/signin/signUp";
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminRegisterPage from "@/pages/admin/AdminRegisterPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";

import HomePage from "@/pages/HomePage";
import ProductsPage from "@/pages/ProductsPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import BYOBPage from "@/pages/BYOBPage";
import NotFound from "@/pages/NotFound";
import PaymentPortal from "@/pages/paymentPortalPage";
import PaymentCompletePage from "./pages/paymentCompletePage";
import MyOrdersPage from "@/pages/myOrdersPage";
import ProfilePage from "@/pages/ProfilePage";

// Create a new QueryClient instance inside the component to ensure proper React context
const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  });

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <CurrencyProvider>
            <CartProvider>
              <LoadingProvider>
                <AuthProvider>
                  <AdminProvider>
                    <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter>
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/products/:productId" element={<ProductDetailPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/byob" element={<BYOBPage />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/payment-portal" element={<PaymentPortal />} />
                        <Route path="/payment-complete" element={<PaymentCompletePage />} />
                        <Route path="/my-orders" element={<MyOrdersPage />} />
                        <Route path="/admin/login" element={<AdminLoginPage />} />
                        <Route path="/admin/register" element={<AdminRegisterPage />} />
                        <Route path="/admin/dashboard" element={
                          <AdminProtectedRoute>
                            <AdminDashboardPage />
                          </AdminProtectedRoute>
                        } />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </BrowserRouter>
                    </TooltipProvider>
                  </AdminProvider>
                </AuthProvider>
              </LoadingProvider>
            </CartProvider>
          </CurrencyProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;