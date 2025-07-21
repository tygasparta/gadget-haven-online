
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Heart } from 'lucide-react';
import SearchBar from './SearchBar';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm border-b">
      {/* Top Banner */}
      <div className="bg-blue-600 py-2 text-center text-sm text-white">
        Free delivery on orders over $50
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">GadgetGenie</h1>
                <p className="text-xs text-gray-500">Your Ultimate Tech Destination</p>
              </div>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <SearchBar />
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-6 text-sm">
              <Link to="/help" className="text-gray-600 hover:text-blue-600">
                Help Centre
              </Link>
              <Link to="/track-order" className="text-gray-600 hover:text-blue-600">
                Track Order
              </Link>
            </div>

            <div className="flex items-center space-x-3">
              <Link to="/auth" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                <User className="w-5 h-5" />
                <span className="hidden sm:inline text-sm">Login</span>
              </Link>

              <Link to="/wishlist" className="text-gray-600 hover:text-blue-600">
                <Heart className="w-5 h-5" />
              </Link>

              <Link to="/cart" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden sm:inline text-sm">Cart</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <SearchBar />
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-50 py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/" className="block py-2 text-gray-700 hover:bg-gray-200">
              Home
            </Link>
            <Link to="/products" className="block py-2 text-gray-700 hover:bg-gray-200">
              Products
            </Link>
            <Link to="/categories" className="block py-2 text-gray-700 hover:bg-gray-200">
              Categories
            </Link>
            <Link to="/help" className="block py-2 text-gray-700 hover:bg-gray-200">
              Help Centre
            </Link>
            <Link to="/track-order" className="block py-2 text-gray-700 hover:bg-gray-200">
              Track Order
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
