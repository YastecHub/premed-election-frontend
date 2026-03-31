import React from 'react';

interface NavigationProps {
  view: 'landing' | 'admin';
  onViewChange: (view: 'landing' | 'admin') => void;
  isVisible: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ view, onViewChange, isVisible }) => {
  return (
    <nav className="fixed top-4 left-0 right-0 z-50 transition-all duration-300">
      <div className="max-w-2xl mx-auto px-4">
        <div className="glass-panel rounded-full shadow-lg shadow-blue-900/5 px-4 md:px-6 py-2 md:py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onViewChange('landing')}>
            <div className="h-8 w-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/30 shrink-0">
              P
            </div>
            <span className="font-bold text-base md:text-lg tracking-tight text-slate-800">
              Pre-Med<span className="text-blue-600">Elect</span>
            </span>
          </div>
          
          <div className="flex bg-slate-100/50 p-1 rounded-full shrink-0">
            <button 
              onClick={() => onViewChange('landing')}
              className={`px-3 md:px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold transition-all duration-300 ${
                view === 'landing' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Voter
            </button>
            <button 
              onClick={() => onViewChange('admin')}
              className={`px-3 md:px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold transition-all duration-300 ${
                view === 'admin' 
                  ? 'bg-slate-800 text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};