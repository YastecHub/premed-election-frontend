import React from 'react';

interface NavigationProps {
  view: 'landing' | 'admin';
  onViewChange: (view: 'landing' | 'admin') => void;
  isVisible: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ view, onViewChange }) => {
  return (
    <nav id="site-navigation" className="fixed top-3 left-0 right-0 z-50">
      <div className="max-w-xl mx-auto px-4">
        <div className="glass-dark rounded-full px-3 sm:px-5 py-2.5 flex items-center justify-between shadow-lg shadow-black/30">

          {/* Logo */}
          <button
            type="button"
            onClick={() => onViewChange('landing')}
            className="flex items-center gap-2 group"
          >
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center shadow-md shadow-violet-500/30 shrink-0">
              <span className="text-white font-extrabold text-[11px] sm:text-xs tracking-tight">PM</span>
            </div>
            <span className="font-bold text-xs sm:text-sm tracking-tight text-zinc-100 whitespace-nowrap">
              Pre-Med<span className="text-violet-400">Elect</span>
            </span>
          </button>

          {/* Tab Switcher — hidden on mobile (bottom dock handles it) */}
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

          {/* Mobile label */}
          <span className="block md:hidden text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
            {view === 'landing' ? 'Voter' : 'Admin'}
          </span>

        </div>
      </div>
    </nav>
  );
};
