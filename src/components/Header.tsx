import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Heart, Menu, LogOut, X, Home, Grid3X3, Tag, Headphones, Smartphone, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuthContext } from '@/contexts/AuthContext';
import { useCartItems } from '@/hooks/useCart';
import { useUserRole } from '@/hooks/useUserRole';
import { useProducts } from '@/hooks/useProducts';

const Header = () => {
  const { user, signOut } = useAuthContext();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const { data: cartItems = [] } = useCartItems();
  const { data: products = [] } = useProducts();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('Header: User:', user?.email);
    console.log('Header: Is Admin:', isAdmin);
    console.log('Header: Role Loading:', roleLoading);
  }, [user, isAdmin, roleLoading]);

  // Calculate total cart items
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Filter products based on search term
  const searchResults = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5); // Limit to 5 results

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setShowSearchResults(false);
      setSearchTerm('');
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSearchResults(value.length > 2);
  };

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) throw error;
      
      toast({ title: "Logged out", description: "See you again soon!" });
      navigate('/');
      setIsMobileMenuOpen(false);
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message,
        variant: "destructive" 
      });
    }
  };

  const handleAccountClick = () => {
    if (isAdmin) {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
    setIsMobileMenuOpen(false);
  };

  const handleAdminClick = () => {
    console.log('Admin button clicked, navigating to /admin');
    navigate('/admin');
    setIsMobileMenuOpen(false);
  };

  const handleCartClick = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    // Trigger cart sidebar to open
    window.dispatchEvent(new Event('openCart'));
    setIsMobileMenuOpen(false);
  };

  const handleWishlistClick = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate('/wishlist');
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMobileMenuOpen(false);
    };
    
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Grid3X3, label: 'Categories', path: '/categories' },
    { icon: Tag, label: 'Deals', path: '/deals' },
    { icon: Headphones, label: 'Audio', path: '/audio' },
    { icon: Smartphone, label: 'Phones', path: '/phones' },
  ];

  return (
    <>
      {/* Top banner */}
      <div className="bg-blue-600 text-white py-2 px-4 text-xs sm:text-sm text-center">
        <span className="block sm:inline">Free delivery on orders over $50</span>
        <div className="hidden lg:float-right lg:block">
          <span className="mr-4">Help Centre</span>
          <span className="mr-4">Track Order</span>
          <span>Sell on Gadget Genie</span>
        </div>
      </div>
      
      {/* Main header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Animated Logo - Responsive */}
            <Link to="/" className="flex items-center flex-shrink-0 group" onClick={closeMobileMenu}>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-2 sm:mr-3 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg group-hover:shadow-xl animate-pulse hover:animate-none">
                <span className="text-white font-bold text-sm sm:text-lg drop-shadow-lg">G</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent truncate group-hover:scale-105 transition-transform duration-300">
                  Gadget Genie
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block group-hover:text-gray-700 transition-colors duration-300">
                  Your Ultimate Tech Destination
                </p>
              </div>
            </Link>

            {/* Enhanced Search bar - Desktop only */}
            <div className="flex-1 max-w-2xl mx-4 lg:mx-8 hidden md:block relative">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search for smartphones, electronics, gadgets..."
                  className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500"
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  onFocus={() => searchTerm.length > 2 && setShowSearchResults(true)}
                  onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                />
                <Button type="submit" className="absolute right-1 top-1 bottom-1 px-4 bg-blue-500 hover:bg-blue-600">
                  <Search className="w-5 h-5" />
                </Button>
              </form>
              
              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 shadow-lg z-50 max-h-80 overflow-y-auto">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => {
                        navigate(`/product/${product.id}`);
                        setShowSearchResults(false);
                        setSearchTerm('');
                      }}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg mr-3"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.category}</p>
                        <p className="text-sm font-semibold text-blue-600">${product.price}</p>
                      </div>
                    </div>
                  ))}
                  <div className="p-2 border-t border-gray-100">
                    <button
                      onClick={handleSearch}
                      className="w-full text-center text-blue-600 hover:text-blue-700 font-medium py-2"
                    >
                      View all results for "{searchTerm}"
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right side icons - Responsive */}
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
              {user ? (
                <>
                  <Button variant="ghost" className="p-2 hidden sm:flex" onClick={handleAccountClick}>
                    <User className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="ml-2 hidden lg:inline">Account</span>
                  </Button>
                  
                  {/* Admin Dashboard Button - Very prominent and always visible for admin users */}
                  {isAdmin && (
                    <Button 
                      onClick={handleAdminClick}
                      className="p-2 hidden sm:flex bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 border-0 shadow-lg"
                    >
                      <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span className="ml-2 font-bold text-sm">ADMIN</span>
                    </Button>
                  )}
                  
                  <Button variant="ghost" className="p-2 hidden sm:flex" onClick={handleWishlistClick}>
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="ml-2 hidden lg:inline">Wishlist</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="p-2 relative"
                    onClick={handleCartClick}
                  >
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="ml-2 hidden lg:inline">Cart</span>
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 text-xs flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 hidden sm:flex"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="ml-2 hidden lg:inline">Logout</span>
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="ghost" className="p-2 hidden sm:flex">
                      <User className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span className="ml-2 hidden lg:inline">Login</span>
                    </Button>
                  </Link>
                  <Button variant="ghost" className="p-2 hidden sm:flex" onClick={() => navigate('/auth')}>
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="ml-2 hidden lg:inline">Wishlist</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="p-2 relative"
                    onClick={() => navigate('/auth')}
                  >
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="ml-2 hidden lg:inline">Cart</span>
                  </Button>
                </>
              )}
              
              {/* Mobile Menu Button */}
              <Button 
                variant="ghost" 
                className="p-2 md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile search */}
          <div className="mt-3 md:hidden">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search for products..."
                className="w-full pl-4 pr-12 py-2 border-2 border-gray-200 rounded-lg"
                value={searchTerm}
                onChange={handleSearchInputChange}
              />
              <Button type="submit" className="absolute right-1 top-1 bottom-1 px-3 bg-blue-500 hover:bg-blue-600">
                <Search className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 md:hidden" onClick={closeMobileMenu}>
            <div 
              className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
                  <Button variant="ghost" size="sm" onClick={closeMobileMenu}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col p-4 space-y-2">
                {/* Navigation Menu Items */}
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    <item.icon className="w-5 h-5 mr-3 text-blue-600" />
                    <span className="text-gray-700">{item.label}</span>
                  </Link>
                ))}

                {/* Divider */}
                <div className="border-t my-4"></div>

                {/* User Actions */}
                {user ? (
                  <>
                    <Button
                      variant="ghost"
                      className="justify-start p-3 h-auto"
                      onClick={handleAccountClick}
                    >
                      <User className="w-5 h-5 mr-3" />
                      <span>My Account</span>
                    </Button>
                    
                    {/* Admin Dashboard - Mobile - Very prominent */}
                    {isAdmin && (
                      <Button
                        onClick={handleAdminClick}
                        className="justify-start p-3 h-auto w-full bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-lg"
                      >
                        <Settings className="w-5 h-5 mr-3" />
                        <span className="font-bold">ADMIN DASHBOARD</span>
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      className="justify-start p-3 h-auto"
                      onClick={handleWishlistClick}
                    >
                      <Heart className="w-5 h-5 mr-3" />
                      <span>Wishlist</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start p-3 h-auto text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      <span>Logout</span>
                    </Button>
                  </>
                ) : (
                  <Link to="/auth" onClick={closeMobileMenu}>
                    <Button
                      variant="ghost"
                      className="justify-start p-3 h-auto w-full"
                    >
                      <User className="w-5 h-5 mr-3" />
                      <span>Login / Sign Up</span>
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
