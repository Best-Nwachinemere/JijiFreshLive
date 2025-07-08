import React, { useState } from 'react';
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
        <div className="mb-4">
          <p className="text-sm">
            Contact us: <a href="mailto:jijifresh0@gmail.com" className="text-green-600 hover:text-green-700 transition-colors">jijifresh0@gmail.com</a>
          </p>
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
              <li><a href="mailto:jijifresh0@gmail.com" className="hover:text-green-600 transition-colors">Contact Us</a></li>
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
          {/* Admin Access Button */}
          <div className="mb-4">
            <AdminAccessButton />
          </div>
          
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

// Admin Access Component
const AdminAccessButton: React.FC = () => {
  const { state, dispatch } = useApp();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple admin code check (in production, this would be more secure)
    if (adminCode === 'JIJI2025ADMIN') {
      const adminUser = {
        id: 'admin-001',
        name: 'JijiFresh Admin',
        email: 'jijifresh0@gmail.com',
        role: 'admin' as const,
        location: 'Uyo, Akwa Ibom',
        isVerified: true,
        rating: 5.0,
        joinedAt: new Date('2024-01-01'),
        lastActive: new Date()
      };
      
      dispatch({ type: 'SET_USER', payload: adminUser });
      setShowAdminLogin(false);
      setAdminCode('');
      
      // Redirect to admin dashboard after a short delay to ensure state is updated
      setTimeout(() => {
        window.location.href = '/admin';
      }, 100);
    } else {
      alert('Invalid admin code');
    }
    
    setIsLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setShowAdminLogin(true)}
        className={`text-xs px-3 py-1 rounded-full transition-colors ${
          state.isDarkMode
            ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
        }`}
      >
        Admin Access
      </button>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`max-w-sm w-full rounded-2xl p-6 ${
            state.isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-lg font-bold mb-4 text-center ${
              state.isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              🔐 Admin Access
            </h3>
            
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  state.isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Admin Code
                </label>
                <input
                  type="password"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  className={`w-full p-3 rounded-lg border transition-colors ${
                    state.isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  placeholder="Enter admin code..."
                  required
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminLogin(false);
                    setAdminCode('');
                  }}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                    state.isDarkMode
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !adminCode}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Checking...' : 'Login'}
                </button>
              </div>
            </form>
            
            <p className={`text-xs text-center mt-4 ${
              state.isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Authorized personnel only
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;