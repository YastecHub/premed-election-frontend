import React from 'react';

interface NavigationProps {
  view: 'landing' | 'admin';
  onViewChange: (view: 'landing' | 'admin') => void;
  isVisible: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ view, onViewChange }) => {
  return (
    // top-2 = 8px. Pill: py-1.5 (12px) + h-6 logo (24px) = ~36px. Total bottom edge ≈ 44px on mobile.
    // On sm+: py-2 (16px) + h-7 logo (28px) = ~44px pill. Top-2 + 44px = 54px total.
    <nav id="site-navigation" className="fixed top-2 left-0 right-0 z-50">
      <div className="max-w-xl mx-auto px-3 sm:px-4">
        <div className="glass-dark rounded-full px-3 sm:px-5 py-1.5 sm:py-2 flex items-center justify-between shadow-lg shadow-black/30">

          {/* Logo */}
          <button
            type="button"
            onClick={() => onViewChange('landing')}
            className="flex items-center gap-1.5 sm:gap-2"
          >
            <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center shadow-md shadow-violet-500/30 shrink-0">
              <span className="text-white font-extrabold text-[10px] tracking-tight">PM</span>
            </div>
            <span className="font-bold text-[11px] sm:text-sm tracking-tight text-zinc-100 whitespace-nowrap">
              Pre-Med<span className="text-violet-400">Elect</span>
            </span>
          </button>

          {/* Desktop tab switcher — hidden on mobile (bottom dock handles it) */}
          <div className="hidden md:flex bg-zinc-800/80 p-0.5 rounded-full gap-0.5 border border-zinc-700/50">
            <button
              type="button"
              onClick={() => onViewChange('landing')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                view === 'landing'
                  ? 'bg-violet-600 text-white shadow-sm shadow-violet-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Voter Portal
            </button>
            <button
              type="button"
              onClick={() => onViewChange('admin')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                view === 'admin'
                  ? 'bg-zinc-100 text-zinc-900 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Mobile: show current section label */}
          <span className="block md:hidden text-[10px] font-semibold text-zinc-500 uppercase tracking-widest pr-1">
            {view === 'landing' ? 'Voter' : 'Admin'}
          </span>

        </div>
      </div>
    </nav>
  );
};
