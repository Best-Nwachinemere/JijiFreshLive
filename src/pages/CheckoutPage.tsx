import React, { useState, useEffect } from 'react';
import { Clock, CreditCard, CheckCircle, ShoppingCart, ArrowLeft, Package, Truck } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Listing } from '../types';

interface CheckoutItem extends Listing {
  negotiatedPrice?: number;
}

interface CheckoutData {
  items: CheckoutItem[];
  deliveryOption?: 'pickup' | 'delivery';
  deliveryFee?: number;
  phoneNumber?: string;
  totalAmount?: number;
}

const CheckoutPage: React.FC = () => {
  const { state } = useApp();
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isPaid, setIsPaid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load checkout data from localStorage
    const storedData = localStorage.getItem('jijiFreshCheckoutItem');
    if (storedData) {
      const data = JSON.parse(storedData);
      setCheckoutData(data);
    }
    setIsLoading(false);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !isPaid && checkoutData?.items?.length) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isPaid) {
      // Timer expired - clear checkout and redirect
      localStorage.removeItem('jijiFreshCheckoutItem');
      window.location.href = '/';
    }
  }, [timeLeft, isPaid, checkoutData]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateTotal = () => {
    if (!checkoutData?.items) return 0;
    const itemsTotal = checkoutData.items.reduce((sum, item) => sum + item.price, 0);
    const deliveryFee = checkoutData.deliveryFee || 0;
    return itemsTotal + deliveryFee;
  };

  const handlePayment = () => {
    setIsPaid(true);
    // Note: In production, this would integrate with actual payment gateway
  };

  const handleContinueShopping = () => {
    localStorage.removeItem('jijiFreshCheckoutItem');
    window.location.href = '/';
  };

  const handleArrangeDelivery = () => {
    // In production, this would redirect to delivery tracking page
    localStorage.removeItem('jijiFreshCheckoutItem');
    window.location.href = '/';
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className={`mt-4 ${state.isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Loading checkout...
          </p>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (!checkoutData?.items?.length) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className={`text-2xl font-bold mb-4 ${
            state.isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Your cart is empty
          </h2>
          <p className={`mb-6 ${
            state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Add some items to your cart to continue
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  // Payment success state
  if (isPaid) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className={`text-3xl font-bold mb-4 ${
            state.isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Payment Successful! 🎉
          </h2>
          <p className={`text-lg mb-8 ${
            state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Your order has been confirmed and the seller has been notified.
          </p>
          
          <div className={`max-w-md mx-auto p-6 rounded-xl mb-8 ${
            state.isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
          }`}>
            <h3 className={`font-bold mb-4 ${
              state.isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Order Summary
            </h3>
            {checkoutData.items.map(item => (
              <div key={item.id} className="flex justify-between items-center mb-2">
                <span className={`${state.isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {item.title}
                </span>
                <span className="font-medium text-green-600">
                  ₦{item.price.toLocaleString()}
                </span>
              </div>
            ))}
            {checkoutData.deliveryFee && (
              <div className="flex justify-between items-center mb-2">
                <span className={`${state.isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Delivery Fee
                </span>
                <span className="font-medium text-green-600">
                  ₦{checkoutData.deliveryFee.toLocaleString()}
                </span>
              </div>
            )}
            <div className={`flex justify-between items-center pt-2 border-t ${
              state.isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <span className={`font-bold ${state.isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Total Paid
              </span>
              <span className="font-bold text-green-600 text-lg">
                ₦{calculateTotal().toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleArrangeDelivery}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
            >
              {checkoutData.deliveryOption === 'delivery' ? (
                <>
                  <Truck className="w-5 h-5" />
                  <span>Track Delivery</span>
                </>
              ) : (
                <>
                  <Package className="w-5 h-5" />
                  <span>Arrange Pickup</span>
                </>
              )}
            </button>
            <button
              onClick={handleContinueShopping}
              className={`px-6 py-3 rounded-lg transition-colors ${
                state.isDarkMode
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active checkout state
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => window.history.back()}
          className={`flex items-center space-x-2 mb-4 ${
            state.isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
          } transition-colors`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        
        <div className="flex items-center justify-between">
          <h1 className={`text-3xl font-bold ${
            state.isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Checkout
          </h1>
          
          {/* Timer */}
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            timeLeft <= 60 
              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
          }`}>
            <Clock className="w-5 h-5" />
            <span className="font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>
        
        {timeLeft <= 60 && (
          <p className="text-red-600 dark:text-red-400 text-sm mt-2">
            ⚠️ Hurry! Items will be released soon
          </p>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className={`rounded-2xl p-6 ${
          state.isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'
        }`}>
          <h2 className={`text-xl font-bold mb-6 ${
            state.isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Order Summary
          </h2>
          
          <div className="space-y-4 mb-6">
            {checkoutData.items.map(item => (
              <div key={item.id} className="flex items-center space-x-4">
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
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">
                    ₦{item.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Info */}
          {checkoutData.deliveryOption && (
            <div className={`p-4 rounded-lg mb-6 ${
              state.isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <h4 className={`font-medium mb-2 ${
                state.isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Delivery Method
              </h4>
              <div className="flex items-center justify-between">
                <span className={`${
                  state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {checkoutData.deliveryOption === 'delivery' ? 'Home Delivery' : 'Pickup from Seller'}
                </span>
                <span className="font-medium text-green-600">
                  {checkoutData.deliveryFee ? `₦${checkoutData.deliveryFee.toLocaleString()}` : 'FREE'}
                </span>
              </div>
              {checkoutData.phoneNumber && (
                <p className={`text-sm mt-1 ${
                  state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Contact: {checkoutData.phoneNumber}
                </p>
              )}
            </div>
          )}

          {/* Total */}
          <div className={`border-t pt-4 ${
            state.isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex justify-between items-center">
              <span className={`text-lg font-bold ${
                state.isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Total Amount
              </span>
              <span className="text-2xl font-bold text-green-600">
                ₦{calculateTotal().toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Instructions */}
        <div className={`rounded-2xl p-6 ${
          state.isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'
        }`}>
          <h2 className={`text-xl font-bold mb-6 ${
            state.isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Payment Instructions
          </h2>
          
          <div className={`p-4 rounded-lg mb-6 ${
            state.isDarkMode ? 'bg-gray-700' : 'bg-blue-50'
          }`}>
            <div className="flex items-center space-x-3 mb-4">
              <CreditCard className="w-6 h-6 text-blue-600" />
              <h3 className={`font-bold ${
                state.isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Bank Transfer Details
              </h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className={`text-sm font-medium ${
                  state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Bank Name
                </label>
                <p className={`font-bold ${
                  state.isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Moniepoint MFB
                </p>
              </div>
              
              <div>
                <label className={`text-sm font-medium ${
                  state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Account Number
                </label>
                <p className={`font-bold text-lg ${
                  state.isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  8123456789
                </p>
              </div>
              
              <div>
                <label className={`text-sm font-medium ${
                  state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Account Name
                </label>
                <p className={`font-bold ${
                  state.isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  JijiFresh Escrow
                </p>
              </div>
              
              <div>
                <label className={`text-sm font-medium ${
                  state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Amount to Transfer
                </label>
                <p className="font-bold text-2xl text-green-600">
                  ₦{calculateTotal().toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg mb-6 ${
            state.isDarkMode ? 'bg-yellow-900/20 border border-yellow-800' : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <h4 className={`font-bold mb-2 ${
              state.isDarkMode ? 'text-yellow-400' : 'text-yellow-800'
            }`}>
              Important Instructions:
            </h4>
            <ul className={`text-sm space-y-1 ${
              state.isDarkMode ? 'text-yellow-300' : 'text-yellow-700'
            }`}>
              <li>• Transfer the exact amount shown above</li>
              <li>• Use your phone number as the transfer reference</li>
              <li>• After payment, click "I Don Pay" below</li>
              <li>• Keep your transfer receipt for verification</li>
            </ul>
          </div>

          <button
            onClick={handlePayment}
            disabled={calculateTotal() <= 0}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            I Don Pay ₦{calculateTotal().toLocaleString()}
          </button>
          
          <p className={`text-xs text-center mt-3 ${
            state.isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Only click this button after completing the bank transfer
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;