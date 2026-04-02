import React from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  return (
    <div className={`fixed top-4 left-4 right-4 z-50 mx-auto max-w-sm animate-in slide-in-from-top-2 duration-300 ${
      type === 'success'
        ? 'bg-emerald-500/15 border border-emerald-500/25 text-emerald-300'
        : 'bg-red-500/15 border border-red-500/25 text-red-300'
    } backdrop-blur-xl rounded-xl shadow-2xl shadow-black/30 p-4 flex items-start gap-3`}>
      <div className="flex-shrink-0 mt-0.5">
        {type === 'success' ? (
          <CheckCircle className="h-5 w-5" />
        ) : (
          <XCircle className="h-5 w-5" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-5">{message}</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="flex-shrink-0 p-0.5 rounded-full hover:bg-white/10 transition-colors text-zinc-400 hover:text-zinc-200"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
