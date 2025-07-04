import React, { useState } from 'react';
import { MapPin, Truck, Phone } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Listing } from '../types';

interface DeliveryModalProps {
  item: Listing;
  finalPrice: number;
  onClose: () => void;
  onConfirm: (deliveryOption: 'pickup' | 'delivery', phoneNumber?: string) => void;
}

const DeliveryModal: React.FC<DeliveryModalProps> = ({ item, finalPrice, onClose, onConfirm }) => {
  const { state } = useApp();
  const [selectedOption, setSelectedOption] = useState<'pickup' | 'delivery'>('pickup');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Get seller's pickup address from user data
  const seller = state.user?.id === item.sellerId ? state.user : null;
  const pickupAddress = seller?.pickupAddress || `${item.location} (Contact seller for exact address)`;

  const handleConfirm = () => {
    if (selectedOption === 'delivery' && !phoneNumber) {
      alert('Please enter your phone number for delivery');
      return;
    }
    
    onConfirm(selectedOption, selectedOption === 'delivery' ? phoneNumber : undefined);
  };

  const deliveryFee = 1000;
  const totalAmount = selectedOption === 'delivery' ? finalPrice + deliveryFee : finalPrice;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className={`max-w-md w-full rounded-2xl p-6 ${
        state.isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <h3 className={`text-xl font-bold mb-4 ${
          state.isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Choose Delivery Option
        </h3>
        
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className={`font-semibold mb-2 ${
            state.isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {item.title}
          </h4>
          <div className="flex justify-between items-center">
            <span className={`${
              state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Final Price:
            </span>
            <span className="font-bold text-green-600">
              ₦{finalPrice.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {/* Pickup Option */}
          <div
            onClick={() => setSelectedOption('pickup')}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedOption === 'pickup'
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : state.isDarkMode
                ? 'border-gray-600 hover:border-gray-500'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-full mt-1 ${
                selectedOption === 'pickup'
                  ? 'bg-green-500 text-white'
                  : state.isDarkMode
                  ? 'bg-gray-700 text-gray-400'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className={`font-semibold ${
                  state.isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Pickup from Seller
                </h4>
                <p className={`text-sm mt-1 ${
                  state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {pickupAddress}
                </p>
                <p className={`text-xs mt-1 font-medium ${
                  selectedOption === 'pickup' ? 'text-green-600' : 'text-gray-500'
                }`}>
                  FREE • Contact seller to arrange pickup time
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">
                  ₦{finalPrice.toLocaleString()}
                </div>
                <div className="text-xs text-green-600">No extra cost</div>
              </div>
            </div>
          </div>

          {/* Delivery Option */}
          <div
            onClick={() => setSelectedOption('delivery')}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedOption === 'delivery'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : state.isDarkMode
                ? 'border-gray-600 hover:border-gray-500'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-full mt-1 ${
                selectedOption === 'delivery'
                  ? 'bg-blue-500 text-white'
                  : state.isDarkMode
                  ? 'bg-gray-700 text-gray-400'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                <Truck className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className={`font-semibold ${
                  state.isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Home Delivery
                </h4>
                <p className={`text-sm mt-1 ${
                  state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Delivered to your location within Akwa Ibom
                </p>
                <p className={`text-xs mt-1 font-medium ${
                  selectedOption === 'delivery' ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  ₦{deliveryFee.toLocaleString()} delivery fee • 1-2 days
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">
                  ₦{totalAmount.toLocaleString()}
                </div>
                <div className="text-xs text-blue-600">+ delivery fee</div>
              </div>
            </div>
          </div>
        </div>

        {/* Phone Number Input for Delivery */}
        {selectedOption === 'delivery' && (
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${
              state.isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Your Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+234 xxx xxx xxxx"
                className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                  state.isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>
            <p className={`text-xs mt-1 ${
              state.isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Delivery person will contact you on this number
            </p>
          </div>
        )}

        {/* Total Summary */}
        <div className={`mb-6 p-4 rounded-lg ${
          state.isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <div className="flex justify-between items-center mb-2">
            <span className={`${
              state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Item Price:
            </span>
            <span>₦{finalPrice.toLocaleString()}</span>
          </div>
          {selectedOption === 'delivery' && (
            <div className="flex justify-between items-center mb-2">
              <span className={`${
                state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Delivery Fee:
              </span>
              <span>₦{deliveryFee.toLocaleString()}</span>
            </div>
          )}
          <div className={`flex justify-between items-center font-bold text-lg border-t pt-2 ${
            state.isDarkMode ? 'border-gray-600 text-white' : 'border-gray-200 text-gray-900'
          }`}>
            <span>Total:</span>
            <span className="text-green-600">₦{totalAmount.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className={`flex-1 py-3 px-4 rounded-lg transition-colors ${
              state.isDarkMode
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all"
          >
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryModal;