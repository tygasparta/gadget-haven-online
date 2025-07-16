
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Categories from "./pages/Categories";
import About from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import CheckoutDetails from "./pages/CheckoutDetails";
import PaymentSuccess from "./pages/PaymentSuccess";
import OrderSuccess from "./pages/OrderSuccess";
import Profile from "./pages/Profile";
import Addresses from "./pages/Addresses";
import PaymentMethods from "./pages/PaymentMethods";
import Notifications from "./pages/Notifications";
import Wishlist from "./pages/Wishlist";
import NotFound from "./pages/NotFound";
import TrackOrder from "./pages/TrackOrder";
import HelpCentre from "./pages/HelpCentre";
import Returns from "./pages/Returns";
import ShippingInfo from "./pages/ShippingInfo";
import Warranty from "./pages/Warranty";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import Accessibility from "./pages/Accessibility";
import SellWithUs from "./pages/SellWithUs";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import Deals from "./pages/Deals";
import Phones from "./pages/Phones";
import Audio from "./pages/Audio";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/category/:category" element={<Products />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/checkout/details" element={<CheckoutDetails />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/order/success" element={<OrderSuccess />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/addresses" element={<Addresses />} />
              <Route path="/payment-methods" element={<PaymentMethods />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/track-order" element={<TrackOrder />} />
              <Route path="/help" element={<HelpCentre />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/shipping" element={<ShippingInfo />} />
              <Route path="/warranty" element={<Warranty />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/cookies" element={<CookiePolicy />} />
              <Route path="/accessibility" element={<Accessibility />} />
              <Route path="/sell" element={<SellWithUs />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/press" element={<Press />} />
              <Route path="/deals" element={<Deals />} />
              <Route path="/phones" element={<Phones />} />
              <Route path="/audio" element={<Audio />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
