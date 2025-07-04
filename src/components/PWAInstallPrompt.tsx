import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt: React.FC = () => {
  const { state } = useApp();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    
    if (isStandalone || isInWebAppiOS) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after a delay to not be intrusive
      setTimeout(() => {
        const hasSeenPrompt = localStorage.getItem('pwa-install-prompt-seen');
        if (!hasSeenPrompt) {
          setShowPrompt(true);
        }
      }, 10000); // Show after 10 seconds
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('Error during installation:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-prompt-seen', 'true');
    
    // Show again after 7 days
    setTimeout(() => {
      localStorage.removeItem('pwa-install-prompt-seen');
    }, 7 * 24 * 60 * 60 * 1000);
  };

  // Don't show if already installed or no prompt available
  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50">
      <div className={`p-4 rounded-2xl shadow-lg border backdrop-blur-sm ${
        state.isDarkMode
          ? 'bg-gray-800/95 border-gray-700 text-white'
          : 'bg-white/95 border-gray-200 text-gray-900'
      }`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <Smartphone className="w-6 h-6 text-green-600" />
          </div>
          
          <div className="flex-1">
            <h4 className="font-semibold mb-1">Install JijiFresh App</h4>
            <p className={`text-sm mb-3 ${
              state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Get the full JijiFresh experience! Install our app for faster access, offline browsing, and push notifications.
            </p>
            
            <div className="flex space-x-2">
              <button
                onClick={handleInstallClick}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                <span>Install</span>
              </button>
              <button
                onClick={handleDismiss}
                className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                  state.isDarkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Not now
              </button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className={`p-1 rounded-lg transition-colors ${
              state.isDarkMode
                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;