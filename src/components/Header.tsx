import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Heart, Menu, LogOut, X, Home, Grid3X3, Tag, Headphones, Smartphone, Settings, Phone, Star, Zap, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuthContext } from '@/contexts/AuthContext';
import { useCartItems } from '@/hooks/useCart';
import { useUserRole } from '@/hooks/useUserRole';
import { useProducts } from '@/hooks/useProducts';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const { user, signOut } = useAuthContext();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const { data: cartItems = [] } = useCartItems();
  const { data: products = [] } = useProducts();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    console.log('Header: User:', user?.email);
    console.log('Header: Is Admin:', isAdmin);
    console.log('Header: Role Loading:', roleLoading);
  }, [user, isAdmin, roleLoading]);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const searchResults = products.filter(product => {
    if (searchTerm.length < 2) return false;
    const searchLower = searchTerm.toLowerCase();
    const searchTerms = searchLower.split(' ').filter(term => term.length > 0);
    const productName = product.name.toLowerCase();
    const productCategory = product.category?.toLowerCase() || '';
    const productBrand = product.brand?.toLowerCase() || '';
    const productDescription = product.description?.toLowerCase() || '';
    const productTags = product.tags?.map(tag => tag.toLowerCase()) || [];
    if (productName.includes(searchLower) || productBrand.includes(searchLower) || productCategory.includes(searchLower)) return true;
    if (searchTerms.length >= 2) {
      const brandMatch = searchTerms.some(term => productBrand.includes(term));
      const categoryMatch = searchTerms.some(term => productCategory.includes(term) || productDescription.includes(term) || productTags.some(tag => tag.includes(term)));
      if (brandMatch && categoryMatch) return true;
    }
    return searchTerms.every(term => productName.includes(term) || productBrand.includes(term) || productCategory.includes(term) || productDescription.includes(term) || productTags.some(tag => tag.includes(term)));
  }).slice(0, 8);

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
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleAccountClick = () => { navigate('/dashboard'); setIsMobileMenuOpen(false); };
  const handleAdminClick = () => { navigate('/admin'); setIsMobileMenuOpen(false); };
  const handleCartClick = () => { if (!user) { navigate('/auth'); return; } window.dispatchEvent(new Event('openCart')); setIsMobileMenuOpen(false); };
  const handleWishlistClick = () => { if (!user) { navigate('/auth'); return; } navigate('/wishlist'); setIsMobileMenuOpen(false); };
  const closeMobileMenu = () => { setIsMobileMenuOpen(false); };

  useEffect(() => {
    const handleRouteChange = () => { setIsMobileMenuOpen(false); };
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  const navTabs = [
    { label: 'New Arrivals', path: '/categories?featured=new' },
    { label: 'Fire Sale', path: '/deals', highlight: 'red' },
    { label: 'Brands Store', path: '/products' },
    { label: 'Categories', path: '/categories' },
    { label: 'Clearance', path: '/deals' },
  ];

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Grid3X3, label: 'Categories', path: '/categories' },
    { icon: Tag, label: 'Deals', path: '/deals' },
    { icon: Headphones, label: 'Audio', path: '/audio' },
    { icon: Smartphone, label: 'Phones', path: '/phones' },
    { icon: Phone, label: 'Contact', path: '/contact' }
  ];

  return (
    <>
      {/* Top utility bar */}
      <div className="bg-white border-b border-gray-200 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between py-1.5 text-xs text-gray-500">
          <span></span>
          <div className="flex items-center space-x-4">
            <Link to="/help" className="hover:text-primary transition-colors">Help Centre</Link>
            <span className="text-gray-300">|</span>
            <Link to="/sell-with-us" className="hover:text-primary transition-colors">Sell on GadgetGenie</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0 group" onClick={closeMobileMenu}>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center mr-2 sm:mr-3 shadow-sm">
                <span className="text-primary-foreground font-bold text-sm sm:text-lg">G</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-primary truncate">GadgetGenie</h1>
              </div>
            </Link>

            {/* Search bar - Desktop */}
            <div className="flex-1 max-w-2xl hidden md:block relative">
              <form onSubmit={handleSearch} className="relative flex">
                <Input
                  type="text"
                  placeholder="Search for products, brands..."
                  className="w-full pl-4 pr-4 py-2.5 border border-gray-300 rounded-l-sm rounded-r-none focus:border-primary focus:ring-0"
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  onFocus={() => searchTerm.length > 2 && setShowSearchResults(true)}
                  onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                />
                <Button type="submit" className="rounded-l-none rounded-r-sm px-5 bg-primary hover:bg-primary/90">
                  <Search className="w-5 h-5" />
                </Button>
              </form>
              
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-sm mt-1 shadow-lg z-[100] max-h-80 overflow-y-auto">
                  {searchResults.map(product => (
                    <div
                      key={product.id}
                      className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => { navigate(`/product/${product.id}`); setShowSearchResults(false); setSearchTerm(''); }}
                    >
                      <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded mr-3" onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop"; }} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate text-sm">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.category}</p>
                        <p className="text-sm font-semibold text-primary">${product.price}</p>
                      </div>
                    </div>
                  ))}
                  <div className="p-2 border-t border-gray-100">
                    <button onClick={handleSearch} className="w-full text-center text-primary hover:text-primary/80 font-medium py-2 text-sm">
                      View all results for "{searchTerm}"
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-1 sm:space-x-3">
              {user ? (
                <>
                  <Link to="/dashboard" className="hidden sm:flex flex-col items-center text-gray-600 hover:text-primary transition-colors px-2">
                    <User className="w-5 h-5" />
                    <span className="text-[10px] mt-0.5">Account</span>
                  </Link>
                  
                  {isAdmin && (
                    <button onClick={handleAdminClick} className="hidden sm:flex flex-col items-center text-gray-600 hover:text-primary transition-colors px-2">
                      <Settings className="w-5 h-5" />
                      <span className="text-[10px] mt-0.5">Admin</span>
                    </button>
                  )}
                  
                  <button onClick={handleWishlistClick} className="hidden sm:flex flex-col items-center text-gray-600 hover:text-primary transition-colors px-2">
                    <Heart className="w-5 h-5" />
                    <span className="text-[10px] mt-0.5">Wishlist</span>
                  </button>

                  <button onClick={handleCartClick} className="flex flex-col items-center text-gray-600 hover:text-primary transition-colors px-2 relative">
                    <ShoppingCart className="w-5 h-5" />
                    <span className="text-[10px] mt-0.5 hidden sm:block">Cart</span>
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-0 bg-primary text-primary-foreground rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-bold">
                        {cartCount}
                      </span>
                    )}
                  </button>

                  <button onClick={handleLogout} className="hidden sm:flex flex-col items-center text-gray-600 hover:text-red-500 transition-colors px-2">
                    <LogOut className="w-5 h-5" />
                    <span className="text-[10px] mt-0.5">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/auth" className="hidden sm:flex flex-col items-center text-gray-600 hover:text-primary transition-colors px-2">
                    <User className="w-5 h-5" />
                    <span className="text-[10px] mt-0.5">Login</span>
                  </Link>
                  <Link to="/auth" className="hidden sm:flex flex-col items-center text-gray-600 hover:text-primary transition-colors px-2">
                    <Heart className="w-5 h-5" />
                    <span className="text-[10px] mt-0.5">Wishlist</span>
                  </Link>
                  <button onClick={() => navigate('/auth')} className="flex flex-col items-center text-gray-600 hover:text-primary transition-colors px-2 relative">
                    <ShoppingCart className="w-5 h-5" />
                    <span className="text-[10px] mt-0.5 hidden sm:block">Cart</span>
                  </button>
                </>
              )}
              
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
            <form onSubmit={handleSearch} className="relative flex">
              <Input type="text" placeholder="Search for products, brands..." className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-l-sm rounded-r-none" value={searchTerm} onChange={handleSearchInputChange} />
              <Button type="submit" className="rounded-l-none rounded-r-sm px-3 bg-primary hover:bg-primary/90">
                <Search className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Navigation tabs - Takealot style */}
        <div className="hidden md:block border-t border-gray-200 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-center divide-x divide-gray-200">
              {navTabs.map(tab => (
                <Link
                  key={tab.path + tab.label}
                  to={tab.path}
                  className={`px-6 py-2 text-sm font-medium transition-colors ${
                    tab.highlight === 'red' 
                      ? 'text-red-600 hover:text-red-700 hover:bg-red-50' 
                      : 'text-gray-600 hover:text-primary hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-[40] md:hidden" onClick={closeMobileMenu}>
            <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b border-gray-200 bg-primary text-primary-foreground">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">G</span>
                    </div>
                    <h2 className="text-lg font-bold">Menu</h2>
                  </div>
                  <Button variant="ghost" size="sm" onClick={closeMobileMenu} className="hover:bg-white/20 text-white p-2">
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                
                {user && (
                  <div className="mt-3 bg-white/10 rounded-lg p-2">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-white/80" />
                      <p className="text-white/80 text-sm truncate">{user.email}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col p-3 space-y-1 max-h-[calc(100vh-120px)] overflow-y-auto">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    <item.icon className="w-5 h-5 text-gray-500 mr-3" />
                    <span className="text-gray-700 font-medium">{item.label}</span>
                  </Link>
                ))}

                <div className="pt-3 border-t border-gray-200 space-y-1">
                  {user ? (
                    <>
                      <button className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50" onClick={handleAccountClick}>
                        <User className="w-5 h-5 text-gray-500 mr-3" />
                        <span className="text-gray-700 font-medium">My Account</span>
                      </button>
                      
                      {isAdmin && (
                        <button className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50" onClick={handleAdminClick}>
                          <Settings className="w-5 h-5 text-gray-500 mr-3" />
                          <span className="text-gray-700 font-medium">Admin Panel</span>
                        </button>
                      )}
                      
                      <button className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50" onClick={handleWishlistClick}>
                        <Heart className="w-5 h-5 text-gray-500 mr-3" />
                        <span className="text-gray-700 font-medium">My Wishlist</span>
                      </button>
                      
                      <button className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50" onClick={handleCartClick}>
                        <ShoppingCart className="w-5 h-5 text-gray-500 mr-3" />
                        <span className="text-gray-700 font-medium">My Cart</span>
                        {cartCount > 0 && (
                          <span className="ml-auto bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                            {cartCount}
                          </span>
                        )}
                      </button>
                      
                      <button className="w-full flex items-center p-3 rounded-lg hover:bg-red-50" onClick={handleLogout}>
                        <LogOut className="w-5 h-5 text-red-500 mr-3" />
                        <span className="text-red-600 font-medium">Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <Link to="/auth" onClick={closeMobileMenu}>
                      <button className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50">
                        <User className="w-5 h-5 text-gray-500 mr-3" />
                        <span className="text-gray-700 font-medium">Sign In / Register</span>
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
