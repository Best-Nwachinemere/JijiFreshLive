import React from 'react';
import { Heart, ExternalLink } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const Footer: React.FC = () => {
  const { state } = useApp();

  return (
    <footer className={`mt-16 border-t transition-colors ${
      state.isDarkMode 
        ? 'bg-gray-900 border-gray-800 text-gray-300' 
        : 'bg-gray-50 border-gray-200 text-gray-600'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-2xl">🌱</div>
              <div>
                <h3 className={`text-lg font-bold ${
                  state.isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  JijiFresh
                </h3>
                <p className={`text-sm ${
                  state.isDarkMode ? 'text-green-400' : 'text-green-600'
                }`}>
                  {state.currentSlogan}
                </p>
              </div>
            </div>
            <p className="text-sm mb-4 max-w-md">
              Your trusted local marketplace connecting buyers and sellers across Nigeria. 
              Fresh deals, trusted transactions, community-driven commerce.
            </p>
            <div className="flex items-center space-x-1 text-sm">
              <span>Powered by</span>
              <span className="text-green-600 font-semibold">Lisk</span>
              <ExternalLink className="w-3 h-3 text-green-600" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`font-semibold mb-4 ${
              state.isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-green-600 transition-colors">Home</a></li>
              <li><a href="/listings" className="hover:text-green-600 transition-colors">Browse Listings</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors">Safety Tips</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className={`font-semibold mb-4 ${
              state.isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Connect
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-green-600 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors">Support Center</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        <div className={`mt-12 pt-8 border-t text-center text-sm ${
          state.isDarkMode ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-center space-x-1">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>for Nigerian communities</span>
          </div>
          <p className="mt-2">
            © 2025 JijiFresh. All rights reserved. Built on Lisk blockchain.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;