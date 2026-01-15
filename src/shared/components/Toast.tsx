import React from 'react';
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  return (
    <div className={`fixed top-4 left-4 right-4 z-50 mx-auto max-w-sm animate-in slide-in-from-top-2 duration-300 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white rounded-lg shadow-lg p-4 flex items-start space-x-3`}>
      <div className="flex-shrink-0 mt-0.5">
        {type === 'success' ? (
          <CheckCircleIcon className="h-5 w-5" />
        ) : (
          <XCircleIcon className="h-5 w-5" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-5">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-0.5 rounded-full hover:bg-white/20 transition-colors"
      >
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
  );
};