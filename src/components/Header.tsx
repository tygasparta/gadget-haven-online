
import React, { useState } from 'react';
import { Search, ShoppingCart, User, Heart, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Header = () => {
  const [cartCount] = useState(0);

  return (
    <>
      {/* Top banner */}
      <div className="bg-blue-600 text-white py-2 px-4 text-sm text-center">
        Free delivery on orders over $50
        <div className="float-right hidden md:block">
          <span className="mr-4">Help Centre</span>
          <span className="mr-4">Track Order</span>
          <span>Sell on Gadget Genie</span>
        </div>
      </div>
      
      {/* Main header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue-600">Gadget Genie</h1>
                <p className="text-sm text-gray-500">Your Ultimate Tech Destination</p>
              </div>
            </div>

            {/* Search bar */}
            <div className="flex-1 max-w-2xl mx-8 hidden md:block">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search for smartphones, electronics, gadgets..."
                  className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500"
                />
                <Button className="absolute right-1 top-1 bottom-1 px-4 bg-red-500 hover:bg-red-600">
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="p-2">
                <User className="w-6 h-6" />
                <span className="ml-2 hidden md:inline">Account</span>
              </Button>
              <Button variant="ghost" className="p-2">
                <Heart className="w-6 h-6" />
                <span className="ml-2 hidden md:inline">Wishlist</span>
              </Button>
              <Button variant="ghost" className="p-2 relative">
                <ShoppingCart className="w-6 h-6" />
                <span className="ml-2 hidden md:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
              <Button variant="ghost" className="p-2 md:hidden">
                <Menu className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Mobile search */}
          <div className="mt-4 md:hidden">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for products..."
                className="w-full pl-4 pr-12 py-2 border-2 border-gray-200 rounded-lg"
              />
              <Button className="absolute right-1 top-1 bottom-1 px-3 bg-red-500 hover:bg-red-600">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
