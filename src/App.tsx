
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Index from './pages/Index';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductDetail from './pages/ProductDetail';
import Phones from './pages/Phones';
import Products from './pages/Products';
import AdminDashboard from './pages/AdminDashboard';

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <div className="App">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/phones" element={<Phones />} />
                <Route path="/products" element={<Products />} />
              </Routes>
            </div>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
