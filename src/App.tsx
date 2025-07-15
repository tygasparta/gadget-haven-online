
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileLoadingScreen from "@/components/MobileLoadingScreen";
import EnhancedPreloader from "@/components/EnhancedPreloader";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Categories from "./pages/Categories";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Addresses from "./pages/Addresses";
import PaymentMethods from "./pages/PaymentMethods";
import Notifications from "./pages/Notifications";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import CheckoutDetails from "./pages/CheckoutDetails";
import OrderSuccess from "./pages/OrderSuccess";
import PaymentSuccess from "./pages/PaymentSuccess";
import TrackOrder from "./pages/TrackOrder";
import Contact from "./pages/Contact";
import AboutUs from "./pages/AboutUs";
import HelpCentre from "./pages/HelpCentre";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import ShippingInfo from "./pages/ShippingInfo";
import Returns from "./pages/Returns";
import Warranty from "./pages/Warranty";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import SellWithUs from "./pages/SellWithUs";
import Deals from "./pages/Deals";
import Phones from "./pages/Phones";
import Audio from "./pages/Audio";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Accessibility from "./pages/Accessibility";

const queryClient = new QueryClient();

const App = () => {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000); // Show preloader for 4 seconds

    return () => clearTimeout(timer);
  }, []);

  // Show mobile loading screen on mobile devices
  if (isMobile && isLoading) {
    return <MobileLoadingScreen />;
  }

  // Show enhanced preloader on desktop
  if (!isMobile && isLoading) {
    return <EnhancedPreloader />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/addresses" element={<Addresses />} />
                <Route path="/payment-methods" element={<PaymentMethods />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/checkout-details" element={<CheckoutDetails />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/track-order" element={<TrackOrder />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/help" element={<HelpCentre />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/cookies" element={<CookiePolicy />} />
                <Route path="/shipping" element={<ShippingInfo />} />
                <Route path="/returns" element={<Returns />} />
                <Route path="/warranty" element={<Warranty />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/press" element={<Press />} />
                <Route path="/sell" element={<SellWithUs />} />
                <Route path="/deals" element={<Deals />} />
                <Route path="/phones" element={<Phones />} />
                <Route path="/audio" element={<Audio />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/accessibility" element={<Accessibility />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
