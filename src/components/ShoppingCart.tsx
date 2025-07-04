import React, { useState, useEffect } from 'react';
import { ShoppingCart as ShoppingCartIcon, X, Plus, Minus, Trash2, Clock, MapPin, Truck } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Listing } from '../types';

interface CartItem extends Listing {
  quantity: number;
  negotiatedPrice?: number;
  holdExpiry: Date;
}

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ isOpen, onClose }) => {
  const { state } = useApp();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [deliveryOption, setDeliveryOption] = useState<'pickup' | 'delivery'>('pickup');

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('jijiFreshCart');
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      setCartItems(cart.map((item: any) => ({
        ...item,
        holdExpiry: new Date(item.holdExpiry)
      })));
    }
  }, []);

  useEffect(() => {
    // Timer countdown
    if (cartItems.length > 0 && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && cartItems.length > 0) {
      // Timer expired - clear cart
      clearCart();
    }
  }, [timeLeft, cartItems.length]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const addToCart = (item: Listing, quantity: number = 1, negotiatedPrice?: number) => {
    const cartItem: CartItem = {
      ...item,
      quantity,
      negotiatedPrice,
      holdExpiry: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now
    };

    setCartItems(prev => {
      const existing = prev.find(ci => ci.id === item.id);
      let newCart;
      
      if (existing) {
        newCart = prev.map(ci => 
          ci.id === item.id 
            ? { ...ci, quantity: ci.quantity + quantity, holdExpiry: new Date(Date.now() + 5 * 60 * 1000) }
            : ci
        );
      } else {
        newCart = [...prev, cartItem];
      }
      
      // Reset timer when adding items
      setTimeLeft(300);
      
      // Save to localStorage
      localStorage.setItem('jijiFreshCart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(prev => {
      const newCart = prev.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      localStorage.setItem('jijiFreshCart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => {
      const newCart = prev.filter(item => item.id !== itemId);
      localStorage.setItem('jijiFreshCart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('jijiFreshCart');
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = item.negotiatedPrice || item.price;
      return sum + (price * item.quantity);
    }, 0);
  };

  const calculateDeliveryFee = () => {
    if (deliveryOption === 'pickup') return 0;
    
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalItems < 3) return 1000;
    if (totalItems <= 6) return 2000;
    if (totalItems <= 10) return 3000;
    return 4000; // 10+ items
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateDeliveryFee();
  };

  const getUniquePickupLocations = () => {
    const locations = new Set(cartItems.map(item => item.location));
    return Array.from(locations);
  };

  const handleCheckout = () => {
    const checkoutData = {
      items: cartItems,
      deliveryOption,
      deliveryFee: calculateDeliveryFee(),
      totalAmount: calculateTotal(),
      pickupLocations: getUniquePickupLocations()
    };
    
    localStorage.setItem('jijiFreshCheckoutItem', JSON.stringify(checkoutData));
    window.location.href = '/checkout';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl ${
        state.isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`sticky top-0 p-6 border-b flex items-center justify-between ${
          state.isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        }`}>
          <div className="flex items-center space-x-3">
            <ShoppingCartIcon className="w-6 h-6 text-green-600" />
            <h2 className={`text-2xl font-bold ${
              state.isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Shopping Cart ({cartItems.length})
            </h2>
          </div>
          
          <div className="flex items-center space-x-4">
            {cartItems.length > 0 && (
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${
                timeLeft <= 60 
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
              }`}>
                <Clock className="w-4 h-4" />
                <span className="font-bold text-sm">{formatTime(timeLeft)}</span>
              </div>
            )}
            
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                state.isDarkMode
                  ? 'hover:bg-gray-700 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className={`text-xl font-semibold mb-2 ${
                state.isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Your cart is empty
              </h3>
              <p className={`${
                state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Add some items to get started
              </p>
            </div>
          ) : (
            <>
              {/* Timer Warning */}
              {timeLeft <= 60 && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-800 dark:text-red-400 text-sm font-medium">
                    ⚠️ Hurry! Your items will be released in {formatTime(timeLeft)}
                  </p>
                </div>
              )}

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map(item => (
                  <div key={item.id} className={`p-4 rounded-xl border ${
                    state.isDarkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      
                      <div className="flex-1">
                        <h3 className={`font-medium ${
                          state.isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {item.title}
                        </h3>
                        <p className={`text-sm ${
                          state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          by {item.sellerName}
                        </p>
                        <div className="flex items-center space-x-1 mt-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className={`text-xs ${
                            state.isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {item.location}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          ₦{((item.negotiatedPrice || item.price) * item.quantity).toLocaleString()}
                        </p>
                        {item.negotiatedPrice && (
                          <p className={`text-xs line-through ${
                            state.isDarkMode ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className={`p-1 rounded transition-colors ${
                            state.isDarkMode
                              ? 'hover:bg-gray-600 text-gray-400'
                              : 'hover:bg-gray-200 text-gray-600'
                          }`}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        
                        <span className={`font-medium ${
                          state.isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className={`p-1 rounded transition-colors ${
                            state.isDarkMode
                              ? 'hover:bg-gray-600 text-gray-400'
                              : 'hover:bg-gray-200 text-gray-600'
                          }`}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Options */}
              <div className={`mb-6 p-4 rounded-xl ${
                state.isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <h4 className={`font-medium mb-3 ${
                  state.isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Delivery Method
                </h4>
                
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="delivery"
                      value="pickup"
                      checked={deliveryOption === 'pickup'}
                      onChange={(e) => setDeliveryOption(e.target.value as 'pickup')}
                      className="text-green-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className={`font-medium ${
                          state.isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          Self Pickup (FREE)
                        </span>
                      </div>
                      <p className={`text-xs mt-1 ${
                        state.isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Pickup from: {getUniquePickupLocations().join(', ')}
                      </p>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="delivery"
                      value="delivery"
                      checked={deliveryOption === 'delivery'}
                      onChange={(e) => setDeliveryOption(e.target.value as 'delivery')}
                      className="text-green-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Truck className="w-4 h-4 text-gray-400" />
                          <span className={`font-medium ${
                            state.isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            Home Delivery
                          </span>
                        </div>
                        <span className="font-bold text-green-600">
                          ₦{calculateDeliveryFee().toLocaleString()}
                        </span>
                      </div>
                      <p className={`text-xs mt-1 ${
                        state.isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items • 1-2 days delivery
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Summary */}
              <div className={`mb-6 p-4 rounded-xl ${
                state.isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <h4 className={`font-medium mb-3 ${
                  state.isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Order Summary
                </h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className={`${
                      state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)
                    </span>
                    <span>₦{calculateSubtotal().toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className={`${
                      state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Delivery Fee
                    </span>
                    <span>₦{calculateDeliveryFee().toLocaleString()}</span>
                  </div>
                  
                  <div className={`flex justify-between font-bold text-lg pt-2 border-t ${
                    state.isDarkMode ? 'border-gray-600 text-white' : 'border-gray-200 text-gray-900'
                  }`}>
                    <span>Total</span>
                    <span className="text-green-600">₦{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={clearCart}
                  className={`flex-1 py-3 px-4 rounded-lg transition-colors ${
                    state.isDarkMode
                      ? 'bg-gray-600 text-white hover:bg-gray-500'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Clear Cart
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex-2 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-medium"
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;