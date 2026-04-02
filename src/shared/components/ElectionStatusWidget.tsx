import React from 'react';
import { ElectionState } from '../types';
import { CountdownTimer } from './CountdownTimer';
import { Flag, Pause, Square } from 'lucide-react';

interface ElectionStatusWidgetProps {
  electionState: ElectionState;
}

export const ElectionStatusWidget: React.FC<ElectionStatusWidgetProps> = ({ electionState }) => {
  const getStatusColor = () => {
    switch (electionState.status) {
      case 'active': return 'bg-emerald-500';
      case 'paused': return 'bg-amber-500';
      case 'ended': return 'bg-red-500';
      default: return 'bg-zinc-500';
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
    <div className="bento-card p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-zinc-100">Election Status</h3>
        <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold text-white ${getStatusColor()}`}>
          {getStatusText()}
        </div>
      </div>

      {electionState.status === 'active' && electionState.endTime ? (
        <div>
          <p className="text-xs text-zinc-500 mb-3 uppercase tracking-wider font-bold">Time Remaining</p>
          <CountdownTimer
            targetDate={electionState.endTime}
            isActive={true}
            isPaused={false}
          />
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="mb-2 flex justify-center">
            {electionState.status === 'ended' ? <Flag className="h-8 w-8 text-zinc-600" /> :
             electionState.status === 'paused' ? <Pause className="h-8 w-8 text-zinc-600" /> :
             <Square className="h-8 w-8 text-zinc-600" />}
          </div>
          <p className="text-sm text-zinc-500">
            {electionState.status === 'ended' ? 'Election has concluded' :
             electionState.status === 'paused' ? 'Election is paused' :
             'Election not started'}
          </p>
        </div>
      )}
    </div>
  );
};
