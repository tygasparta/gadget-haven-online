import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, Heart, Menu, LogOut, X, Home, Grid3X3, Tag, Headphones, Smartphone, Settings, Phone, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuthContext } from '@/contexts/AuthContext';
import { useCartItems } from '@/hooks/useCart';
import { useUserRole } from '@/hooks/useUserRole';
import MegaMenu from './MegaMenu';
import SearchAutocomplete from './SearchAutocomplete';

const Header = () => {
  const { user, signOut } = useAuthContext();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const { data: cartItems = [] } = useCartItems();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  useEffect(() => {
    console.log('Header: User:', user?.email);
    console.log('Header: Is Admin:', isAdmin);
    console.log('Header: Role Loading:', roleLoading);
  }, [user, isAdmin, roleLoading]);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

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
    const handleRouteChange = () => { setIsMobileMenuOpen(false); setIsMegaMenuOpen(false); };
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  const location = useLocation();
  const currentUrl = location.pathname + location.search;
  const navTabs = [
    { label: 'Deals', path: '/deals', highlight: 'red' },
    { label: 'New Arrivals', path: '/products?filter=new-arrivals' },
    { label: 'Smartphones', path: '/products?category=smartphones' },
    { label: 'Laptops', path: '/products?category=laptops' },
    { label: 'Gaming', path: '/products?category=gaming' },
    { label: 'Accessories', path: '/products?category=accessories' },
    { label: 'Smart Home', path: '/products?category=smart-home' },
    { label: 'Brands', path: '/products' },
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
      {/* Main header */}
      <header className="bg-background shadow-sm sticky top-0 z-40 relative">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0 group" onClick={closeMobileMenu}>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center mr-2 sm:mr-3 shadow-sm">
                <span className="text-primary-foreground font-bold text-sm sm:text-lg">G</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-primary truncate leading-tight">GadgetGenie</h1>
                <p className="hidden sm:block text-[10px] tracking-wide text-muted-foreground font-medium -mt-0.5">TECH FOR A SMARTER TOMORROW</p>
              </div>
            </Link>

            {/* Search bar - Desktop */}
            <div className="flex-1 max-w-2xl hidden md:block">
              <SearchAutocomplete variant="desktop" />
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-1 sm:space-x-3">
              {user ? (
                <>
                  <Link to="/dashboard" className="hidden sm:flex flex-col items-center text-muted-foreground hover:text-primary transition-colors px-2">
                    <User className="w-5 h-5" />
                    <span className="text-[10px] mt-0.5">Account</span>
                  </Link>

                  {isAdmin && (
                    <button onClick={handleAdminClick} className="hidden sm:flex flex-col items-center text-muted-foreground hover:text-primary transition-colors px-2">
                      <Settings className="w-5 h-5" />
                      <span className="text-[10px] mt-0.5">Admin</span>
                    </button>
                  )}

                  <button onClick={handleWishlistClick} className="hidden sm:flex flex-col items-center text-muted-foreground hover:text-primary transition-colors px-2">
                    <Heart className="w-5 h-5" />
                    <span className="text-[10px] mt-0.5">Wishlist</span>
                  </button>

                  <button onClick={handleCartClick} className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors px-2 relative">
                    <ShoppingCart className="w-5 h-5" />
                    <span className="text-[10px] mt-0.5 hidden sm:block">Cart</span>
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-0 bg-primary text-primary-foreground rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-bold animate-badge-pop">
                        {cartCount}
                      </span>
                    )}
                  </button>

                  <button onClick={handleLogout} className="hidden sm:flex flex-col items-center text-muted-foreground hover:text-destructive transition-colors px-2">
                    <LogOut className="w-5 h-5" />
                    <span className="text-[10px] mt-0.5">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/auth" className="hidden sm:flex flex-col items-center text-muted-foreground hover:text-primary transition-colors px-2">
                    <User className="w-5 h-5" />
                    <span className="text-[10px] mt-0.5">Login</span>
                  </Link>
                  <Link to="/auth" className="hidden sm:flex flex-col items-center text-muted-foreground hover:text-primary transition-colors px-2">
                    <Heart className="w-5 h-5" />
                    <span className="text-[10px] mt-0.5">Wishlist</span>
                  </Link>
                  <button onClick={() => navigate('/auth')} className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors px-2 relative">
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
            <SearchAutocomplete variant="mobile" />
          </div>
        </div>

        {/* Navigation tabs + mega menu trigger */}
        <div className="hidden md:block border-t border-border bg-background">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-1 overflow-x-auto">
              <div
                className="relative"
                onMouseEnter={() => setIsMegaMenuOpen(true)}
              >
                <button
                  onClick={() => navigate('/categories')}
                  className={`flex items-center gap-1.5 pr-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap ${
                    isMegaMenuOpen ? 'text-primary' : 'text-foreground hover:text-primary'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" strokeWidth={1.75} />
                  All Categories
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>
              {navTabs.map(tab => (
                <Link
                  key={tab.path + tab.label}
                  to={tab.path}
                  onMouseEnter={() => setIsMegaMenuOpen(false)}
                  className={`px-3 py-2.5 text-sm transition-colors whitespace-nowrap border-b-2 ${
                    currentUrl === tab.path
                      ? 'border-primary text-primary font-medium'
                      : tab.highlight === 'red'
                        ? 'border-transparent text-destructive font-medium hover:opacity-80'
                        : 'border-transparent text-foreground/80 hover:text-primary'
                  }`}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
          </div>
          <MegaMenu open={isMegaMenuOpen} onClose={() => setIsMegaMenuOpen(false)} />
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-[40] md:hidden" onClick={closeMobileMenu}>
            <div className="fixed top-0 right-0 h-full w-80 bg-background shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b border-border bg-primary text-primary-foreground">
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
                    className="flex items-center p-3 rounded-lg hover:bg-muted transition-colors"
                    onClick={closeMobileMenu}
                  >
                    <item.icon className="w-5 h-5 text-muted-foreground mr-3" />
                    <span className="text-foreground font-medium">{item.label}</span>
                  </Link>
                ))}

                <div className="pt-3 border-t border-border space-y-1">
                  {user ? (
                    <>
                      <button className="w-full flex items-center p-3 rounded-lg hover:bg-muted" onClick={handleAccountClick}>
                        <User className="w-5 h-5 text-muted-foreground mr-3" />
                        <span className="text-foreground font-medium">My Account</span>
                      </button>

                      {isAdmin && (
                        <button className="w-full flex items-center p-3 rounded-lg hover:bg-muted" onClick={handleAdminClick}>
                          <Settings className="w-5 h-5 text-muted-foreground mr-3" />
                          <span className="text-foreground font-medium">Admin Panel</span>
                        </button>
                      )}

                      <button className="w-full flex items-center p-3 rounded-lg hover:bg-muted" onClick={handleWishlistClick}>
                        <Heart className="w-5 h-5 text-muted-foreground mr-3" />
                        <span className="text-foreground font-medium">My Wishlist</span>
                      </button>

                      <button className="w-full flex items-center p-3 rounded-lg hover:bg-muted" onClick={handleCartClick}>
                        <ShoppingCart className="w-5 h-5 text-muted-foreground mr-3" />
                        <span className="text-foreground font-medium">My Cart</span>
                        {cartCount > 0 && (
                          <span className="ml-auto bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                            {cartCount}
                          </span>
                        )}
                      </button>

                      <button className="w-full flex items-center p-3 rounded-lg hover:bg-destructive/10" onClick={handleLogout}>
                        <LogOut className="w-5 h-5 text-destructive mr-3" />
                        <span className="text-destructive font-medium">Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <Link to="/auth" onClick={closeMobileMenu}>
                      <button className="w-full flex items-center p-3 rounded-lg hover:bg-muted">
                        <User className="w-5 h-5 text-muted-foreground mr-3" />
                        <span className="text-foreground font-medium">Sign In / Register</span>
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
