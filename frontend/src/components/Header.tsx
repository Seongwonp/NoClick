import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className="fixed top-0 w-full z-50 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm font-plus-jakarta-sans antialiased">
      <div className="flex justify-between items-center h-16 px-6 max-w-7xl mx-auto">
        <Link to="/" className="text-xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
          No-Click
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={`font-semibold pb-1 transition-colors duration-200 ${
              location.pathname === '/'
                ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500'
                : 'text-gray-500 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-300'
            }`}
          >
            Home
          </Link>
          <Link
            to="/history"
            className={`font-medium transition-colors duration-200 ${
              location.pathname === '/history'
                ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500 pb-1'
                : 'text-gray-500 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-300'
            }`}
          >
            My History
          </Link>
          <Link
            to="/how-it-works"
            className={`font-medium transition-colors duration-200 ${
              location.pathname === '/how-it-works'
                ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500 pb-1'
                : 'text-gray-500 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-300'
            }`}
          >
            How it Works
          </Link>
        </nav>
        <Link
          to="/analysis"
          className="bg-primary-container text-on-primary-container px-5 py-2 rounded-xl font-bold active:scale-95 transition-transform duration-150 hover:bg-emerald-600 hover:text-white"
        >
          Start Analysis
        </Link>
      </div>
    </header>
  );
};

export default Header;
