import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import ListingsPage from './pages/ListingsPage';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CheckoutPage from './pages/CheckoutPage';
import ErrorBoundary from './utils/errorBoundary';
import OfflineIndicator from './components/OfflineIndicator';
import PerformanceMonitor from './components/PerformanceMonitor';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import { useNotifications } from './components/NotificationSystem';
import { analytics } from './utils/analytics';

function AppContent() {
  const { NotificationSystem } = useNotifications();

  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
            analytics.track('service_worker_registered');
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
            analytics.trackError(registrationError, 'service_worker_registration');
          });
      });
    }

    // Track initial page load
    analytics.trackPageView(window.location.pathname);

    // Performance monitoring
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          analytics.trackPerformance('lcp', entry.startTime, 'ms');
        }
        if (entry.entryType === 'first-input') {
          analytics.trackPerformance('fid', (entry as any).processingStart - entry.startTime, 'ms');
        }
      }
    });

    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });

    return () => observer.disconnect();
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/seller-dashboard" element={<SellerDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </Layout>
      <NotificationSystem />
      <OfflineIndicator />
      <PerformanceMonitor />
      <PWAInstallPrompt />
    </Router>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;