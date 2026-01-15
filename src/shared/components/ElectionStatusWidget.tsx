import React from 'react';
import { ElectionState } from '../types';
import { CountdownTimer } from './CountdownTimer';

interface ElectionStatusWidgetProps {
  electionState: ElectionState;
}

export const ElectionStatusWidget: React.FC<ElectionStatusWidgetProps> = ({ electionState }) => {
  const getStatusColor = () => {
    switch (electionState.status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'ended': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  const getStatusText = () => {
    switch (electionState.status) {
      case 'active': return 'LIVE';
      case 'paused': return 'PAUSED';
      case 'ended': return 'ENDED';
      default: return 'INACTIVE';
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Election Status</h3>
        <div className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getStatusColor()}`}>
          {getStatusText()}
        </div>
      </div>
      
      {electionState.status === 'active' && electionState.endTime ? (
        <div>
          <p className="text-sm text-slate-400 mb-3">Time Remaining</p>
          <CountdownTimer 
            targetDate={electionState.endTime}
            isActive={true}
            isPaused={false}
          />
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="text-2xl mb-2">
            {electionState.status === 'ended' ? '🏁' : 
             electionState.status === 'paused' ? '⏸️' : '⏹️'}
          </div>
          <p className="text-sm text-slate-400">
            {electionState.status === 'ended' ? 'Election has concluded' :
             electionState.status === 'paused' ? 'Election is paused' :
             'Election not started'}
          </p>
        </div>
      )}
    </div>
  );
};