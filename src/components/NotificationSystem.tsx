import React, { useState, useEffect } from 'react';
import { X, Bell, Check, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationSystemProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ notifications, onRemove }) => {
  const { state } = useApp();

  useEffect(() => {
    notifications.forEach(notification => {
      if (notification.duration) {
        const timer = setTimeout(() => {
          onRemove(notification.id);
        }, notification.duration);

        return () => clearTimeout(timer);
      }
    });
  }, [notifications, onRemove]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBackgroundColor = (type: string) => {
    const base = state.isDarkMode ? 'dark:' : '';
    switch (type) {
      case 'success':
        return `bg-green-50 ${base}bg-green-900/20 border-green-200 ${base}border-green-800`;
      case 'error':
        return `bg-red-50 ${base}bg-red-900/20 border-red-200 ${base}border-red-800`;
      case 'warning':
        return `bg-yellow-50 ${base}bg-yellow-900/20 border-yellow-200 ${base}border-yellow-800`;
      case 'info':
      default:
        return `bg-blue-50 ${base}bg-blue-900/20 border-blue-200 ${base}border-blue-800`;
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`p-4 rounded-xl border shadow-lg animate-fade-in ${getBackgroundColor(notification.type)}`}
        >
          <div className="flex items-start space-x-3">
            {getIcon(notification.type)}
            <div className="flex-1 min-w-0">
              <h4 className={`font-medium text-sm ${
                state.isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {notification.title}
              </h4>
              <p className={`text-sm mt-1 ${
                state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {notification.message}
              </p>
              {notification.action && (
                <button
                  onClick={notification.action.onClick}
                  className="text-sm font-medium text-green-600 hover:text-green-700 mt-2"
                >
                  {notification.action.label}
                </button>
              )}
            </div>
            <button
              onClick={() => onRemove(notification.id)}
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
      ))}
    </div>
  );
};

// Hook for managing notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { ...notification, id }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const showSuccess = (title: string, message: string, duration = 5000) => {
    addNotification({ type: 'success', title, message, duration });
  };

  const showError = (title: string, message: string, duration = 7000) => {
    addNotification({ type: 'error', title, message, duration });
  };

  const showWarning = (title: string, message: string, duration = 6000) => {
    addNotification({ type: 'warning', title, message, duration });
  };

  const showInfo = (title: string, message: string, duration = 5000) => {
    addNotification({ type: 'info', title, message, duration });
  };

  return {
    notifications,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    NotificationSystem: () => (
      <NotificationSystem 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    )
  };
};

export default NotificationSystem;