import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Candidate } from '../../../shared/types';

interface VoteConfirmationModalProps {
  isOpen: boolean;
  candidate: Candidate | null;
  isSubmitting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const VoteConfirmationModal: React.FC<VoteConfirmationModalProps> = ({
  isOpen,
  candidate,
  isSubmitting,
  onConfirm,
  onCancel
}) => {
  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onCancel} />
      <div className="bento-card w-[92%] sm:w-full max-w-sm p-5 sm:p-7 relative z-10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="bg-amber-500/15 border border-amber-500/20 p-3.5 rounded-2xl mb-5">
            <AlertCircle className="h-8 w-8 text-amber-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-zinc-100 mb-1">
            Final Confirmation
          </h3>
          <p className="text-zinc-400 mb-5 text-sm leading-relaxed">
            You are about to cast your vote for
          </p>
          <div className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-xl px-4 py-3 mb-6">
            <p className="font-bold text-zinc-100 text-base">
              {candidate.name}
            </p>
          </div>
          <div className="flex gap-3 w-full">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 font-semibold rounded-xl transition-colors disabled:opacity-50 text-sm min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/20 transition-all active:scale-95 disabled:opacity-50 flex justify-center items-center text-sm min-h-[44px]"
            >
              {isSubmitting ? 'Signing...' : 'Confirm Vote'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
