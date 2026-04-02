import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'warning'
}) => {
  if (!isOpen) return null;

  const getColors = () => {
    switch (type) {
      case 'danger':
        return {
          icon: 'text-red-400',
          iconBg: 'bg-red-500/15 border border-red-500/20',
          button: 'bg-red-600 hover:bg-red-500'
        };
      case 'info':
        return {
          icon: 'text-violet-400',
          iconBg: 'bg-violet-500/15 border border-violet-500/20',
          button: 'bg-violet-600 hover:bg-violet-500'
        };
      default:
        return {
          icon: 'text-amber-400',
          iconBg: 'bg-amber-500/15 border border-amber-500/20',
          button: 'bg-amber-600 hover:bg-amber-500'
        };
    }
  };

  const colors = getColors();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="bento-card w-full max-w-sm p-5 relative z-10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 p-2 rounded-xl ${colors.iconBg}`}>
            <AlertTriangle className={`h-5 w-5 ${colors.icon}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-zinc-100 mb-1">{title}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{message}</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="flex-shrink-0 p-1 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-zinc-700/50 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 font-medium rounded-xl transition-colors min-h-[44px] text-sm"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`w-full sm:w-auto px-4 py-2.5 ${colors.button} text-white font-medium rounded-xl transition-colors min-h-[44px] text-sm`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
