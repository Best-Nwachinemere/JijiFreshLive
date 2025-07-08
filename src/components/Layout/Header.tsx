import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X, User, LogIn, LogOut, ShoppingBag, LayoutDashboard, ShoppingCart } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import ShoppingCartComponent from '../ShoppingCart';

const Header: React.FC = () => {
  const { state, dispatch, slogans } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [sloganIndex, setSloganIndex] = useState(0);
  const [cartItemCount, setCartItemCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setSloganIndex((prev) => {
        const nextIndex = (prev + 1) % slogans.length;
        dispatch({ type: 'SET_SLOGAN', payload: slogans[nextIndex] });
        return nextIndex;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [slogans, dispatch]);

  useEffect(() => {
    // Update cart item count
    const updateCartCount = () => {
      const savedCart = localStorage.getItem('jijiFreshCart');
      if (savedCart) {
        try {
          const cart = JSON.parse(savedCart);
          const count = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
          setCartItemCount(count);
        } catch (error) {
          console.error('Error parsing cart:', error);
          setCartItemCount(0);
        }
      } else {
        setCartItemCount(0);
      }
    };

    updateCartCount();
    
    // Listen for storage changes
    window.addEventListener('storage', updateCartCount);
    
    // Listen for custom cart update events
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
    document.documentElement.classList.toggle('dark');
  };

  const handleLogin = () => {
    // Mock login - in real app, this would be proper authentication
    const mockUser = {
      id: '2',
      name: 'Chinedu Okoro',
      email: 'chinedu@example.com',
      role: 'seller' as const,
      location: 'Ikeja, Lagos',
      isVerified: true,
      joinedAt: new Date()
    };
    dispatch({ type: 'SET_USER', payload: mockUser });
  };

  const handleLogout = () => {
    localStorage.removeItem('jijiFreshUser');
    dispatch({ type: 'SET_USER', payload: null });
  };

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        state.isDarkMode 
          ? 'bg-gray-900/95 backdrop-blur-md border-gray-700' 
          : 'bg-white/95 backdrop-blur-md border-gray-200'
      } border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 group-hover:scale-110 transition-transform duration-200">
                <img 
                  src="/JijiFreshlogo.svg" 
                  alt="JijiFresh Logo" 
                  className="w-full h-full"
                />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${
                  state.isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  JijiFresh
                </h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className={`transition-colors duration-200 ${
                  location.pathname === '/' 
                    ? (state.isDarkMode ? 'text-green-400' : 'text-green-600')
                    : (state.isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900')
                }`}
              >
                Home
              </Link>
              <Link
                to="/listings"
                className={`transition-colors duration-200 ${
                  location.pathname === '/listings' 
                    ? (state.isDarkMode ? 'text-green-400' : 'text-green-600')
                    : (state.isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900')
                }`}
              >
                Browse Listings
              </Link>
              
              {state.user && state.user.role === 'seller' && (
                <Link
                  to="/seller-dashboard"
                  className={`flex items-center space-x-1 transition-colors duration-200 ${
                    location.pathname === '/seller-dashboard' 
                      ? (state.isDarkMode ? 'text-green-400' : 'text-green-600')
                      : (state.isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900')
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
              )}

              {state.user && state.user.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`flex items-center space-x-1 transition-colors duration-200 ${
                    location.pathname === '/admin' 
                      ? (state.isDarkMode ? 'text-green-400' : 'text-green-600')
                      : (state.isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900')
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              )}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Shopping Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className={`relative p-2 rounded-lg transition-colors ${
                  state.isDarkMode 
                    ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </button>

              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  state.isDarkMode 
                    ? 'text-yellow-400 hover:bg-gray-800' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {state.isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {state.user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-green-600" />
                    <span className={`hidden sm:block ${state.isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {state.user.name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:block">Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`md:hidden p-2 rounded-lg ${
                  state.isDarkMode ? 'text-white hover:bg-gray-800' : 'text-gray-900 hover:bg-gray-100'
                }`}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className={`md:hidden py-4 border-t ${
              state.isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <nav className="flex flex-col space-y-3">
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-2 py-1 transition-colors duration-200 ${
                    location.pathname === '/' 
                      ? (state.isDarkMode ? 'text-green-400' : 'text-green-600')
                      : (state.isDarkMode ? 'text-gray-300' : 'text-gray-600')
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/listings"
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-2 py-1 transition-colors duration-200 ${
                    location.pathname === '/listings' 
                      ? (state.isDarkMode ? 'text-green-400' : 'text-green-600')
                      : (state.isDarkMode ? 'text-gray-300' : 'text-gray-600')
                  }`}
                >
                  Browse Listings
                </Link>
                
                {state.user && state.user.role === 'seller' && (
                  <Link
                    to="/seller-dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-2 py-1 transition-colors duration-200 ${
                      location.pathname === '/seller-dashboard'
                        ? (state.isDarkMode ? 'text-green-400' : 'text-green-600')
                        : (state.isDarkMode ? 'text-gray-300' : 'text-gray-600')
                    }`}
                  >
                    Seller Dashboard
                  </Link>
                )}

                {state.user && state.user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-2 py-1 transition-colors duration-200 ${
                      location.pathname === '/admin'
                        ? (state.isDarkMode ? 'text-green-400' : 'text-green-600')
                        : (state.isDarkMode ? 'text-gray-300' : 'text-gray-600')
                    }`}
                  >
                    Admin Dashboard
                  </Link>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Shopping Cart Modal */}
      <ShoppingCartComponent isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;