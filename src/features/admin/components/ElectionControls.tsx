import React, { useState } from 'react';
import { votingService } from '../../../core/services/voting.service';
import { useNotification } from '../../../shared/contexts/NotificationContext';
import { useElection } from '../../../shared/hooks/useElection';
import { Play, Pause, Square, Clock, AlertTriangle } from 'lucide-react';

const inputClass =
  'block w-full rounded-xl bg-zinc-800 border border-zinc-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 px-4 py-3 text-zinc-100 text-sm outline-none transition-all min-h-[44px] text-center font-mono';

export const ElectionControls: React.FC = () => {
  const { showError, showSuccess } = useNotification();
  const electionState = useElection();
  const [isLoading, setIsLoading] = useState(false);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(1);
  const [minutes, setMinutes] = useState(0);

  const getTotalMinutes = () => (days * 24 * 60) + (hours * 60) + minutes;

  const handleElectionAction = async (action: string) => {
    const totalMinutes = getTotalMinutes();
    if (action === 'start' && totalMinutes === 0) {
      showError('Please set a valid duration for the election');
      return;
    }

    setIsLoading(true);
    try {
      await votingService.toggleElection(action, action === 'start' ? totalMinutes : undefined);
      showSuccess(`Election ${action}ed successfully`);
    } catch (error: any) {
      showError(error.message || `Failed to ${action} election`);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = () => {
    switch (electionState.status) {
      case 'active':   return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'paused':   return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30';
      case 'ended':    return 'bg-red-500/15 text-red-400 border-red-500/30';
      default:         return 'bg-zinc-700/50 text-zinc-400 border-zinc-600/50';
    }
  };

  const getStatusText = () => {
    switch (electionState.status) {
      case 'active': return 'Live — accepting votes';
      case 'paused': return 'Paused';
      case 'ended':  return 'Ended';
      default:       return 'Not started';
    }
  };

  const formatDuration = () => {
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    return parts.length > 0 ? parts.join(' ') : '—';
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-lg sm:text-xl font-bold text-zinc-100">Election Control Center</h2>
        <div className={`px-3 py-1.5 rounded-xl border text-xs font-semibold ${getStatusBadge()}`}>
          {getStatusText()}
        </div>
      </div>

      {/* Duration Settings */}
      <div className="bento-card p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-violet-400" />
          <h3 className="text-sm font-semibold text-zinc-100">Duration Settings</h3>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <label htmlFor="election-days" className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
              Days
            </label>
            <input
              id="election-days"
              type="number"
              value={days}
              onChange={(e) => setDays(Math.max(0, Number(e.target.value)))}
              className={inputClass}
              min="0"
              max="30"
              aria-label="Election duration in days"
            />
          </div>

          <div>
            <label htmlFor="election-hours" className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
              Hours
            </label>
            <input
              id="election-hours"
              type="number"
              value={hours}
              onChange={(e) => setHours(Math.max(0, Math.min(23, Number(e.target.value))))}
              className={inputClass}
              min="0"
              max="23"
              aria-label="Election duration in hours"
            />
          </div>

          <div>
            <label htmlFor="election-minutes" className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
              Minutes
            </label>
            <input
              id="election-minutes"
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(Math.max(0, Math.min(59, Number(e.target.value))))}
              className={inputClass}
              min="0"
              max="59"
              aria-label="Election duration in minutes"
            />
          </div>
        </div>

        <div className="bg-zinc-800/60 rounded-xl px-4 py-3 border border-zinc-700/50">
          <p className="text-sm text-zinc-300">
            Total: <span className="font-semibold text-violet-400">{formatDuration()}</span>
            <span className="text-zinc-500 text-xs ml-2">({getTotalMinutes()} min)</span>
          </p>
        </div>
      </div>

      {/* Election Actions */}
      <div className="bento-card p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-zinc-100 mb-4">Actions</h3>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => handleElectionAction('start')}
            disabled={isLoading || electionState.status === 'active' || getTotalMinutes() === 0}
            className="flex items-center justify-center gap-2 px-3 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:border disabled:border-zinc-700/50 text-white rounded-xl transition-all min-h-[44px] text-sm font-semibold"
          >
            <Play className="h-4 w-4" />
            <span>Start</span>
          </button>

          <button
            onClick={() => handleElectionAction('pause')}
            disabled={isLoading || electionState.status !== 'active'}
            className="flex items-center justify-center gap-2 px-3 py-3 bg-yellow-600 hover:bg-yellow-500 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:border disabled:border-zinc-700/50 text-white rounded-xl transition-all min-h-[44px] text-sm font-semibold"
          >
            <Pause className="h-4 w-4" />
            <span>Pause</span>
          </button>

          <button
            onClick={() => handleElectionAction('resume')}
            disabled={isLoading || electionState.status !== 'paused'}
            className="flex items-center justify-center gap-2 px-3 py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:border disabled:border-zinc-700/50 text-white rounded-xl transition-all min-h-[44px] text-sm font-semibold"
          >
            <Play className="h-4 w-4" />
            <span>Resume</span>
          </button>

          <button
            onClick={() => handleElectionAction('stop')}
            disabled={isLoading || electionState.status === 'ended'}
            className="flex items-center justify-center gap-2 px-3 py-3 bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:border disabled:border-zinc-700/50 text-white rounded-xl transition-all min-h-[44px] text-sm font-semibold"
          >
            <Square className="h-4 w-4" />
            <span>Stop</span>
          </button>
        </div>
      </div>

      {/* Election Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bento-card p-4">
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Current Status</p>
          <p className="text-lg font-bold text-zinc-100 capitalize">{electionState.status || 'Not Started'}</p>
        </div>

        <div className="bento-card p-4">
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">End Time</p>
          <p className="text-sm font-semibold text-zinc-100">
            {electionState.endTime ? new Date(electionState.endTime).toLocaleString() : '—'}
          </p>
        </div>
      </div>

      {/* Status Alerts */}
      {electionState.status === 'active' && (
        <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-xl px-4 py-3 flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse flex-shrink-0" />
          <p className="text-emerald-400 text-sm font-medium">Election is live and accepting votes</p>
        </div>
      )}

      {electionState.status === 'paused' && (
        <div className="bg-yellow-500/10 border border-yellow-500/25 rounded-xl px-4 py-3 flex items-center gap-2">
          <Pause className="h-4 w-4 text-yellow-400 flex-shrink-0" />
          <p className="text-yellow-400 text-sm font-medium">Election is paused. Votes are not being accepted.</p>
        </div>
      )}

      {getTotalMinutes() === 0 && electionState.status !== 'active' && electionState.status !== 'paused' && (
        <div className="bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm font-medium">Set a valid duration before starting the election.</p>
        </div>
      )}
    </div>
  );
};
