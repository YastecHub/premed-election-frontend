import React, { useState } from 'react';
import { votingService } from '../../../core/services/voting.service';
import { useNotification } from '../../../shared/contexts/NotificationContext';
import { useElection } from '../../../shared/hooks/useElection';
import { PlayIcon, PauseIcon, StopIcon, ClockIcon } from '@heroicons/react/24/outline';

export const ElectionControls: React.FC = () => {
  const { showError, showSuccess } = useNotification();
  const electionState = useElection();
  const [isLoading, setIsLoading] = useState(false);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(1);
  const [minutes, setMinutes] = useState(0);

  const getTotalMinutes = () => {
    return (days * 24 * 60) + (hours * 60) + minutes;
  };

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

  const getStatusColor = () => {
    switch (electionState.status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'paused': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'ended': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusText = () => {
    switch (electionState.status) {
      case 'active': return 'Election is currently active';
      case 'paused': return 'Election is paused';
      case 'ended': return 'Election has ended';
      default: return 'Election not started';
    }
  };

  const formatDuration = () => {
    const parts = [];
    if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
    if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
    return parts.length > 0 ? parts.join(', ') : 'No duration set';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-white">Election Control Center</h2>
        <div className={`px-3 py-2 rounded-lg border text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </div>
      </div>
      
      {/* Duration Settings */}
      <div className="bg-slate-800 rounded-lg p-4 md:p-6">
        <div className="flex items-center space-x-2 mb-4">
          <ClockIcon className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Duration Settings</h3>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Days</label>
              <input
                type="number"
                value={days}
                onChange={(e) => setDays(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 bg-slate-700 rounded-lg text-white min-h-[44px]"
                min="0"
                max="30"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Hours</label>
              <input
                type="number"
                value={hours}
                onChange={(e) => setHours(Math.max(0, Math.min(23, Number(e.target.value))))}
                className="w-full px-3 py-2 bg-slate-700 rounded-lg text-white min-h-[44px]"
                min="0"
                max="23"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Minutes</label>
              <input
                type="number"
                value={minutes}
                onChange={(e) => setMinutes(Math.max(0, Math.min(59, Number(e.target.value))))}
                className="w-full px-3 py-2 bg-slate-700 rounded-lg text-white min-h-[44px]"
                min="0"
                max="59"
              />
            </div>
          </div>
          
          <div className="bg-slate-700/50 rounded-lg p-3">
            <p className="text-sm text-slate-300">
              <span className="font-medium">Total Duration:</span> {formatDuration()}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              ({getTotalMinutes()} minutes total)
            </p>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="bg-slate-800 rounded-lg p-4 md:p-6">
        <h3 className="text-lg font-semibold mb-4 text-white">Election Actions</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => handleElectionAction('start')}
            disabled={isLoading || electionState.status === 'active' || getTotalMinutes() === 0}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:text-slate-400 rounded-lg transition-colors min-h-[44px] font-medium"
          >
            <PlayIcon className="h-4 w-4" />
            <span>Start Election</span>
          </button>
          
          <button
            onClick={() => handleElectionAction('pause')}
            disabled={isLoading || electionState.status !== 'active'}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-slate-600 disabled:text-slate-400 rounded-lg transition-colors min-h-[44px] font-medium"
          >
            <PauseIcon className="h-4 w-4" />
            <span>Pause Election</span>
          </button>
          
          <button
            onClick={() => handleElectionAction('resume')}
            disabled={isLoading || electionState.status !== 'paused'}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:text-slate-400 rounded-lg transition-colors min-h-[44px] font-medium"
          >
            <PlayIcon className="h-4 w-4" />
            <span>Resume Election</span>
          </button>
          
          <button
            onClick={() => handleElectionAction('stop')}
            disabled={isLoading || electionState.status === 'ended'}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-slate-600 disabled:text-slate-400 rounded-lg transition-colors min-h-[44px] font-medium"
          >
            <StopIcon className="h-4 w-4" />
            <span>Stop Election</span>
          </button>
        </div>
      </div>

      {/* Election Info */}
      <div className="bg-slate-800 rounded-lg p-4 md:p-6">
        <h3 className="text-lg font-semibold mb-4 text-white">Election Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-slate-300 mb-2">Current Status</h4>
            <p className="text-lg font-bold text-white capitalize">{electionState.status || 'Not Started'}</p>
          </div>
          
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-slate-300 mb-2">End Time</h4>
            <p className="text-lg font-bold text-white">
              {electionState.endTime ? new Date(electionState.endTime).toLocaleString() : 'Not Set'}
            </p>
          </div>
        </div>
      </div>

      {/* Warning Messages */}
      {electionState.status === 'active' && (
        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <p className="text-green-400 font-medium">Election is currently live and accepting votes</p>
          </div>
        </div>
      )}
      
      {electionState.status === 'paused' && (
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-medium">⏸️ Election is paused. Voters cannot submit votes at this time.</p>
        </div>
      )}
      
      {getTotalMinutes() === 0 && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400 font-medium">⚠️ Please set a valid duration before starting the election.</p>
        </div>
      )}
    </div>
  );
};