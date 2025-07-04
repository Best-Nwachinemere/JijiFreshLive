import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const OfflineIndicator: React.FC = () => {
  const { state } = useApp();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showRetry, setShowRetry] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowRetry(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setTimeout(() => setShowRetry(true), 3000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  if (isOnline) return null;

  return (
    <div className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 p-4 rounded-xl border shadow-lg ${
      state.isDarkMode
        ? 'bg-gray-800 border-gray-700 text-white'
        : 'bg-white border-gray-200 text-gray-900'
    }`}>
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <WifiOff className="w-6 h-6 text-red-500" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium">You're offline</h4>
          <p className={`text-sm ${
            state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Check your internet connection
          </p>
        </div>
        {showRetry && (
          <button
            onClick={handleRetry}
            className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm">Retry</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default OfflineIndicator;