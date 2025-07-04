import React from 'react';
import { useApp } from '../../contexts/AppContext';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { state } = useApp();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      state.isDarkMode 
        ? 'cute-bg cute-bg-pattern' 
        : 'cute-bg-light cute-bg-pattern'
    }`}>
      <Header />
      <main className="animate-fade-in">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;