import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-12 px-6 mt-auto border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 font-plus-jakarta-sans text-sm">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-7xl mx-auto">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="text-lg font-bold text-gray-900 dark:text-white">No-Click</div>
          <p className="text-gray-500 dark:text-gray-400">Made with Love by No-Click</p>
        </div>
        <div className="flex gap-8">
          <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-300 underline underline-offset-4 opacity-80 hover:opacity-100 transition-opacity">Privacy Policy</a>
          <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-300 underline underline-offset-4 opacity-80 hover:opacity-100 transition-opacity">Terms of Service</a>
          <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-300 underline underline-offset-4 opacity-80 hover:opacity-100 transition-opacity">Help Center</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
