
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import Index from './pages/Index';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Categories from './pages/Categories';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Wishlist from './pages/Wishlist';
import AdminDashboard from './pages/AdminDashboard';
import SearchResults from './pages/SearchResults';
import Checkout from './pages/Checkout';
import CheckoutDetails from './pages/CheckoutDetails';
import PaymentSuccess from './pages/PaymentSuccess';
import OrderSuccess from './pages/OrderSuccess';
import Orders from './pages/Orders';
import TrackOrder from './pages/TrackOrder';
import Profile from './pages/Profile';
import PaymentTest from './pages/PaymentTest';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/checkout/details" element={<CheckoutDetails />} />
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/order/success" element={<OrderSuccess />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/track-order" element={<TrackOrder />} />
                <Route path="/payment-test" element={<PaymentTest />} />
                {/* Add a catch-all route for unmatched paths */}
                <Route path="*" element={<Index />} />
              </Routes>
            </BrowserRouter>
            <Toaster />
            <SonnerToaster />
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
