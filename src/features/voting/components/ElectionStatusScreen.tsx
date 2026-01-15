import React from 'react';
import { CheckBadgeIcon, LockClosedIcon, PauseIcon } from '@heroicons/react/24/solid';
import { User, ElectionState } from '../../../shared/types';
import { CountdownTimer } from '../../../shared/components/CountdownTimer';

interface ElectionStatusScreenProps {
  user: User;
  electionState: ElectionState;
  onLogout: () => void;
}

export const ElectionStatusScreen: React.FC<ElectionStatusScreenProps> = ({
  user,
  electionState,
  onLogout
}) => {
  if (user.hasVoted) {
    return (
      <div className="glass-panel rounded-3xl p-8 md:p-12 text-center max-w-2xl mx-auto shadow-2xl border-white/60 flex flex-col items-center animate-in zoom-in-95 duration-700">
        <div className="relative">
          <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
          <div className="bg-gradient-to-br from-green-400 to-emerald-600 p-6 rounded-full shadow-xl relative z-10 mb-6">
            <CheckBadgeIcon className="h-16 w-16 md:h-20 md:w-20 text-white" />
          </div>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3 tracking-tight">
          Vote Recorded
        </h2>
        <p className="text-slate-500 text-base md:text-lg max-w-md leading-relaxed">
          Thank you, <span className="font-bold text-slate-900">{user.fullName}</span>. 
          Your ballot has been securely encrypted and added to the tally.
        </p>
        
        <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200 w-full max-w-sm">
          <div className="flex justify-between items-center text-sm text-slate-500 mb-2">
            <span>Vote Status</span>
            <span className="font-mono text-slate-400">Confirmed</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 w-full"></div>
          </div>
          <div className="text-center mt-2 text-xs text-green-600 font-bold uppercase tracking-wider">
            Securely Recorded
          </div>
        </div>

        <button 
          onClick={onLogout} 
          className="mt-10 px-8 py-3 border border-slate-300 rounded-xl text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-900 transition-colors w-full md:w-auto"
        >
          Sign Out Securely
        </button>
      </div>
    );
  }

  if (electionState.status === 'paused') {
    return (
      <div className="glass-panel rounded-3xl p-8 md:p-12 text-center max-w-2xl mx-auto shadow-2xl border-white/60 flex flex-col items-center animate-in zoom-in-95 duration-700">
        <div className="relative">
          <div className="absolute inset-0 bg-amber-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
          <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-6 rounded-full shadow-xl relative z-10 mb-6">
            <PauseIcon className="h-16 w-16 md:h-20 md:w-20 text-white" />
          </div>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3 tracking-tight">
          Voting Paused
        </h2>
        <p className="text-slate-600 text-base md:text-lg max-w-md leading-relaxed mb-8">
          The election has been temporarily paused by an administrator. Voting is currently disabled.
        </p>
        
        {electionState.endTime && (
          <div className="w-full max-w-sm mb-8">
            <CountdownTimer 
              targetDate={electionState.endTime}
              isActive={false}
              isPaused={true}
            />
          </div>
        )}

        <div className="p-6 bg-amber-50 rounded-xl border border-amber-200 w-full max-w-sm mb-8">
          <p className="text-sm text-amber-700 font-semibold">⏸ Waiting for Administrator</p>
          <p className="text-xs text-amber-600 mt-2">Please wait while the election is resumed</p>
        </div>

        <button 
          onClick={onLogout} 
          className="px-8 py-3 border border-slate-300 rounded-xl text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-900 transition-colors w-full md:w-auto"
        >
          Sign Out
        </button>
      </div>
    );
  }

  if (electionState.status === 'ended') {
    return (
      <div className="glass-panel rounded-3xl p-8 md:p-12 text-center max-w-2xl mx-auto shadow-2xl border-white/60 flex flex-col items-center animate-in zoom-in-95 duration-700">
        <div className="relative">
          <div className="absolute inset-0 bg-red-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
          <div className="bg-gradient-to-br from-red-400 to-orange-600 p-6 rounded-full shadow-xl relative z-10 mb-6">
            <LockClosedIcon className="h-16 w-16 md:h-20 md:w-20 text-white" />
          </div>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3 tracking-tight">
          Voting Closed
        </h2>
        <p className="text-slate-500 text-base md:text-lg max-w-md leading-relaxed mb-8">
          The election has ended. Thank you for your participation, 
          <span className="font-bold text-slate-900">{user.fullName}</span>.
        </p>
        
        <div className="p-6 bg-blue-50 rounded-xl border border-blue-200 w-full max-w-sm mb-8">
          <p className="text-sm text-blue-700 font-semibold">Results are being tallied</p>
          <p className="text-xs text-blue-600 mt-2">Final counts will be announced shortly</p>
        </div>

        <button 
          onClick={onLogout} 
          className="px-8 py-3 border border-slate-300 rounded-xl text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-900 transition-colors w-full md:w-auto"
        >
          Sign Out Securely
        </button>
      </div>
    );
  }

  return null;
};