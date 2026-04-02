import React from 'react';
import { X, AlertTriangle, CheckCircle } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  message: string;
  type: 'error' | 'success';
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  message,
  type,
  onClose
}) => {
  if (!isOpen) return null;

  const isError = type === 'error';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bento-card w-full max-w-sm p-5 relative z-10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 p-2 rounded-xl border ${
            isError ? 'bg-red-500/15 border-red-500/20' : 'bg-emerald-500/15 border-emerald-500/20'
          }`}>
            {isError
              ? <AlertTriangle className="h-5 w-5 text-red-400" />
              : <CheckCircle className="h-5 w-5 text-emerald-400" />
            }
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`text-base font-semibold ${isError ? 'text-red-400' : 'text-emerald-400'}`}>
              {isError ? 'Error' : 'Success'}
            </h3>
            <p className="mt-0.5 text-sm text-zinc-400 leading-relaxed">{message}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            title="Close notification"
            className="flex-shrink-0 p-1 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-zinc-700/50 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors text-white min-h-[40px] ${
              isError ? 'bg-red-600 hover:bg-red-500' : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
