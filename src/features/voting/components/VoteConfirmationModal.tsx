import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
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
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onCancel}></div>
      <div className="bg-white rounded-3xl shadow-2xl w-[95%] md:w-full max-w-md p-6 md:p-8 relative z-10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="bg-yellow-50 p-4 rounded-full mb-6 ring-8 ring-yellow-50/50">
            <ExclamationCircleIcon className="h-10 w-10 md:h-12 md:w-12 text-yellow-500" />
          </div>
          <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-2">
            Final Confirmation
          </h3>
          <p className="text-slate-500 mb-8 leading-relaxed text-sm md:text-base">
            You are about to securely cast your vote for <br/>
            <span className="font-bold text-slate-900 text-lg md:text-xl block mt-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
              {candidate.name}
            </span>
          </p>
          <div className="flex space-x-3 w-full">
            <button 
              onClick={onCancel} 
              disabled={isSubmitting} 
              className="flex-1 py-3 md:py-4 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors disabled:opacity-50 text-sm md:text-base"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm} 
              disabled={isSubmitting} 
              className="flex-1 py-3 md:py-4 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 transition-all transform active:scale-95 disabled:opacity-50 flex justify-center items-center text-sm md:text-base"
            >
              {isSubmitting ? 'Signing...' : 'Confirm Vote'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};