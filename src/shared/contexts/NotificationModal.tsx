import React from 'react';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative z-10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="flex items-start space-x-4">
          <div className={`flex-shrink-0 p-2 rounded-full ${type === 'error' ? 'bg-red-100' : 'bg-green-100'}`}>
            <ExclamationTriangleIcon className={`h-6 w-6 ${type === 'error' ? 'text-red-600' : 'text-green-600'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-semibold ${type === 'error' ? 'text-red-900' : 'text-green-900'}`}>
              {type === 'error' ? 'Error' : 'Success'}
            </h3>
            <p className="mt-1 text-sm text-slate-600 leading-relaxed">{message}</p>
          </div>
          <button
            onClick={onClose}
            title="Close notification"
            className="flex-shrink-0 p-1 rounded-full hover:bg-slate-100 transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-slate-400" />
          </button>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              type === 'error' 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};