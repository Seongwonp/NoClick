import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 px-6 mt-auto border-t border-gray-100 bg-white">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center md:items-start gap-2">
           <div className="flex items-center gap-2">
             <div className="w-6 h-6 bg-emerald-600 rounded-lg" />
             <span className="font-display-lg text-[18px] font-black tracking-tighter text-on-surface">No-Click</span>
           </div>
           <p className="text-[12px] text-on-surface-variant font-medium text-center md:text-left">
             Real-time Review Forensics Powered by AI
           </p>
        </div>
        
        <div className="flex items-center gap-6 text-[11px] font-bold text-on-surface-variant/45 tracking-wider uppercase">
          <span>Accuracy</span>
          <span>Trust</span>
          <span>Efficiency</span>
        </div>

        <div className="text-[11px] text-on-surface-variant/60 font-medium">
          © 2026 No-Click Project Team. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
