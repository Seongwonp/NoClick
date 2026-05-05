import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="fixed top-0 w-full z-50 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm font-plus-jakarta-sans antialiased">
      <div className="flex justify-between items-center h-16 px-6 max-w-7xl mx-auto">
        <Link to="/" className="text-xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
          No-Click
        </Link>
        
        {/* Desktop Navigation */}
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

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-gray-500 hover:text-emerald-500 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="material-symbols-outlined">
            {isMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col p-4 space-y-4">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={`font-semibold px-4 py-2 rounded-lg ${
                location.pathname === '/' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-500'
              }`}
            >
              Home
            </Link>
            <Link
              to="/history"
              onClick={() => setIsMenuOpen(false)}
              className={`font-semibold px-4 py-2 rounded-lg ${
                location.pathname === '/history' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-500'
              }`}
            >
              My History
            </Link>
            <Link
              to="/how-it-works"
              onClick={() => setIsMenuOpen(false)}
              className={`font-semibold px-4 py-2 rounded-lg ${
                location.pathname === '/how-it-works' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-500'
              }`}
            >
              How it Works
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
