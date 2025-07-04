import React from 'react';
import { useApp } from '../contexts/AppContext';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Loading...', 
  fullScreen = false 
}) => {
  const { state } = useApp();

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 dark:border-gray-700`}></div>
        <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-green-600 border-t-transparent absolute top-0 left-0`}></div>
      </div>
      {text && (
        <p className={`${textSizeClasses[size]} font-medium ${
          state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={`fixed inset-0 flex items-center justify-center z-50 ${
        state.isDarkMode ? 'bg-gray-900/80' : 'bg-white/80'
      } backdrop-blur-sm`}>
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;