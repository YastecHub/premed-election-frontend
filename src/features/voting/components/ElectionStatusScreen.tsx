import React from 'react';
import { BadgeCheck, Lock, Pause, Clock } from 'lucide-react';
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
      <div className="bento-card p-8 sm:p-10 text-center max-w-md mx-auto flex flex-col items-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-emerald-400 rounded-full blur-2xl opacity-15 animate-pulse" />
          <div className="bg-emerald-500/15 border border-emerald-500/25 p-5 rounded-full relative z-10">
            <BadgeCheck className="h-12 w-12 sm:h-14 sm:w-14 text-emerald-400" />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 mb-2 tracking-tight">
          Vote Recorded
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base max-w-sm leading-relaxed">
          Thank you, <span className="font-bold text-zinc-200">{user.fullName}</span>.
          Your ballot has been securely encrypted and added to the tally.
        </p>

        <div className="mt-6 p-4 bg-zinc-800/60 rounded-xl border border-zinc-700/50 w-full max-w-xs">
          <div className="flex justify-between items-center text-xs text-zinc-500 mb-2">
            <span>Vote Status</span>
            <span className="font-mono text-zinc-400">Confirmed</span>
          </div>
          <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-full rounded-full" />
          </div>
          <p className="text-center mt-2 text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
            Securely Recorded
          </p>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="mt-8 px-6 py-3 border border-zinc-700 rounded-xl text-zinc-400 font-semibold hover:bg-zinc-800 hover:text-zinc-200 transition-colors w-full sm:w-auto text-sm min-h-[44px]"
        >
          Sign Out Securely
        </button>
      </div>
    );
  }

  if (electionState.status === 'not_started') {
    return (
      <div className="bento-card p-8 sm:p-10 text-center max-w-md mx-auto flex flex-col items-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-violet-400 rounded-full blur-2xl opacity-15 animate-pulse" />
          <div className="bg-violet-500/15 border border-violet-500/25 p-5 rounded-full relative z-10">
            <Lock className="h-12 w-12 sm:h-14 sm:w-14 text-violet-400" />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 mb-2 tracking-tight">
          Election Not Started
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base max-w-sm leading-relaxed mb-6">
          Welcome, <span className="font-bold text-zinc-200">{user.fullName}</span>.
          The election has not started yet. Please check back later.
        </p>

        <div className="p-4 bg-violet-500/10 rounded-xl border border-violet-500/20 w-full max-w-xs mb-6">
          <p className="text-xs text-violet-300 font-semibold flex items-center justify-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> Waiting for Administrator
          </p>
          <p className="text-[10px] text-violet-400/70 mt-1">The admin will start the election soon</p>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="px-6 py-3 border border-zinc-700 rounded-xl text-zinc-400 font-semibold hover:bg-zinc-800 hover:text-zinc-200 transition-colors w-full sm:w-auto text-sm min-h-[44px]"
        >
          Sign Out
        </button>
      </div>
    );
  }

  if (electionState.status === 'paused') {
    return (
      <div className="bento-card p-8 sm:p-10 text-center max-w-md mx-auto flex flex-col items-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-amber-400 rounded-full blur-2xl opacity-15 animate-pulse" />
          <div className="bg-amber-500/15 border border-amber-500/25 p-5 rounded-full relative z-10">
            <Pause className="h-12 w-12 sm:h-14 sm:w-14 text-amber-400" />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 mb-2 tracking-tight">
          Voting Paused
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base max-w-sm leading-relaxed mb-6">
          The election has been temporarily paused by an administrator. Voting is currently disabled.
        </p>

        {electionState.endTime && (
          <div className="w-full max-w-xs mb-6">
            <CountdownTimer
              targetDate={electionState.endTime}
              isActive={false}
              isPaused={true}
            />
          </div>
        )}

        <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20 w-full max-w-xs mb-6">
          <p className="text-xs text-amber-300 font-semibold flex items-center justify-center gap-1.5">
            <Pause className="h-3.5 w-3.5" /> Waiting for Administrator
          </p>
          <p className="text-[10px] text-amber-400/70 mt-1">Please wait while the election is resumed</p>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="px-6 py-3 border border-zinc-700 rounded-xl text-zinc-400 font-semibold hover:bg-zinc-800 hover:text-zinc-200 transition-colors w-full sm:w-auto text-sm min-h-[44px]"
        >
          Sign Out
        </button>
      </div>
    );
  }

  if (electionState.status === 'ended') {
    return (
      <div className="bento-card p-8 sm:p-10 text-center max-w-md mx-auto flex flex-col items-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-red-400 rounded-full blur-2xl opacity-15 animate-pulse" />
          <div className="bg-red-500/15 border border-red-500/25 p-5 rounded-full relative z-10">
            <Lock className="h-12 w-12 sm:h-14 sm:w-14 text-red-400" />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 mb-2 tracking-tight">
          Voting Closed
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base max-w-sm leading-relaxed mb-6">
          The election has ended. Thank you for your participation,{' '}
          <span className="font-bold text-zinc-200">{user.fullName}</span>.
        </p>

        <div className="p-4 bg-violet-500/10 rounded-xl border border-violet-500/20 w-full max-w-xs mb-6">
          <p className="text-xs text-violet-300 font-semibold">Results are being tallied</p>
          <p className="text-[10px] text-violet-400/70 mt-1">Final counts will be announced shortly</p>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="px-6 py-3 border border-zinc-700 rounded-xl text-zinc-400 font-semibold hover:bg-zinc-800 hover:text-zinc-200 transition-colors w-full sm:w-auto text-sm min-h-[44px]"
        >
          Sign Out Securely
        </button>
      </div>
    );
  }

  return null;
};
