import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import SearchBar from './SearchBar';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm border-b">
      {/* Top Banner */}
      <div className="bg-gray-100 py-2 text-center text-sm text-gray-600">
        Free shipping on orders over $50!
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">TechShop</span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <SearchBar />
          </div>

          {/* Icons and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <Link to="/cart" className="text-gray-600 hover:text-gray-900">
              <ShoppingCart className="w-5 h-5" />
            </Link>

            {/* User Icon */}
            <Link to="/profile" className="text-gray-600 hover:text-gray-900">
              <User className="w-5 h-5" />
            </Link>

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
            <Link to="/profile" className="block py-2 text-gray-700 hover:bg-gray-200">
              Profile
            </Link>
            <Link to="/cart" className="block py-2 text-gray-700 hover:bg-gray-200">
              Cart
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
