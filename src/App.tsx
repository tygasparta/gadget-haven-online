
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Checkout from "@/pages/Checkout";
import CheckoutDetails from "@/pages/CheckoutDetails";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Categories from "@/pages/Categories";
import Phones from "@/pages/Phones";
import Audio from "@/pages/Audio";
import Deals from "@/pages/Deals";
import Wishlist from "@/pages/Wishlist";
import Orders from "@/pages/Orders";
import TrackOrder from "@/pages/TrackOrder";
import PaymentMethods from "@/pages/PaymentMethods";
import Addresses from "@/pages/Addresses";
import Notifications from "@/pages/Notifications";
import AdminDashboard from "@/pages/AdminDashboard";
import AboutUs from "@/pages/AboutUs";
import Contact from "@/pages/Contact";
import HelpCentre from "@/pages/HelpCentre";
import ShippingInfo from "@/pages/ShippingInfo";
import Returns from "@/pages/Returns";
import Warranty from "@/pages/Warranty";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import CookiePolicy from "@/pages/CookiePolicy";
import Accessibility from "@/pages/Accessibility";
import SellWithUs from "@/pages/SellWithUs";
import Careers from "@/pages/Careers";
import Press from "@/pages/Press";
import NotFound from "@/pages/NotFound";
import PaymentSuccess from "@/pages/PaymentSuccess";
import OrderSuccess from "@/pages/OrderSuccess";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/checkout/details" element={<CheckoutDetails />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/phones" element={<Phones />} />
              <Route path="/categories/audio" element={<Audio />} />
              <Route path="/deals" element={<Deals />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/track-order" element={<TrackOrder />} />
              <Route path="/payment-methods" element={<PaymentMethods />} />
              <Route path="/addresses" element={<Addresses />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/help" element={<HelpCentre />} />
              <Route path="/shipping" element={<ShippingInfo />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/warranty" element={<Warranty />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/cookies" element={<CookiePolicy />} />
              <Route path="/accessibility" element={<Accessibility />} />
              <Route path="/sell" element={<SellWithUs />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/press" element={<Press />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
