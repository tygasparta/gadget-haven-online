
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ThemeProvider } from "next-themes";
import EnhancedPreloader from "@/components/EnhancedPreloader";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import { usePWA } from "@/hooks/usePWA";
import { Suspense, lazy } from "react";

// Lazy load components
const Index = lazy(() => import("./pages/Index"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Categories = lazy(() => import("./pages/Categories"));
const Deals = lazy(() => import("./pages/Deals"));
const Auth = lazy(() => import("./pages/Auth"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Checkout = lazy(() => import("./pages/Checkout"));
const CheckoutDetails = lazy(() => import("./pages/CheckoutDetails"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const Profile = lazy(() => import("./pages/Profile"));
const Orders = lazy(() => import("./pages/Orders"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Addresses = lazy(() => import("./pages/Addresses"));
const PaymentMethods = lazy(() => import("./pages/PaymentMethods"));
const TrackOrder = lazy(() => import("./pages/TrackOrder"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Contact = lazy(() => import("./pages/Contact"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const HelpCentre = lazy(() => import("./pages/HelpCentre"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const Returns = lazy(() => import("./pages/Returns"));
const ShippingInfo = lazy(() => import("./pages/ShippingInfo"));
const Warranty = lazy(() => import("./pages/Warranty"));
const Careers = lazy(() => import("./pages/Careers"));
const Press = lazy(() => import("./pages/Press"));
const SellWithUs = lazy(() => import("./pages/SellWithUs"));
const Accessibility = lazy(() => import("./pages/Accessibility"));
const Phones = lazy(() => import("./pages/Phones"));
const Audio = lazy(() => import("./pages/Audio"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  usePWA();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <TooltipProvider>
          <AuthProvider>
            <CartProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <PWAInstallPrompt />
                <Suspense fallback={<EnhancedPreloader />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/deals" element={<Deals />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/checkout-details" element={<CheckoutDetails />} />
                    <Route path="/payment-success" element={<PaymentSuccess />} />
                    <Route path="/order-success" element={<OrderSuccess />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/addresses" element={<Addresses />} />
                    <Route path="/payment-methods" element={<PaymentMethods />} />
                    <Route path="/track-order" element={<TrackOrder />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/help" element={<HelpCentre />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/cookies" element={<CookiePolicy />} />
                    <Route path="/returns" element={<Returns />} />
                    <Route path="/shipping" element={<ShippingInfo />} />
                    <Route path="/warranty" element={<Warranty />} />
                    <Route path="/careers" element={<Careers />} />
                    <Route path="/press" element={<Press />} />
                    <Route path="/sell" element={<SellWithUs />} />
                    <Route path="/accessibility" element={<Accessibility />} />
                    <Route path="/phones" element={<Phones />} />
                    <Route path="/audio" element={<Audio />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </CartProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
