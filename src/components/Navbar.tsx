import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User, Search } from 'lucide-react';
import CartDrawer from './CartDrawer';
import { useCartStore } from '../store/cartStore';
import Logo from '../static/images/Group 4 (1).png';

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const items = useCartStore((state) => state.items);

  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-md text-gray-800">
                {/* <img src={Logo} alt="logo" className="w-14 h-32 object-contain" /> */}
                ADORN WITH TINA
              </Link>
            </div>

            {/* <div className="hidden md:flex items-center space-x-8">
              <Link to="/collections" className="text-gray-600 hover:text-gray-900">
                Collections
              </Link>
              <Link to="/collections/necklaces" className="text-gray-600 hover:text-gray-900">
                Necklaces
              </Link>
              <Link to="/collections/rings" className="text-gray-600 hover:text-gray-900">
                Rings
              </Link>
              <Link to="/collections/earrings" className="text-gray-600 hover:text-gray-900">
                Earrings
              </Link>
              <Link to="/collections/bracelets" className="text-gray-600 hover:text-gray-900">
                Bracelets
              </Link>
            </div> */}

            <div className="flex items-center space-x-4">
              {/* <button className="text-gray-600 hover:text-gray-900">
                <Search size={20} />
              </button>
              <button className="text-gray-600 hover:text-gray-900">
                <User size={20} />
              </button> */}
              <button
                className="text-gray-600 hover:text-gray-900 relative flex items-center gap-2"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingBag size={20}  /> 
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;