import React from 'react';
import { CandidateRanking } from '../../../shared/types';
import { getRankDisplay } from '../../../shared/utils/ranking';

interface LiveResultsProps {
  rankings: CandidateRanking[];
}

export const LiveResults: React.FC<LiveResultsProps> = ({ rankings }) => {
  const getRankBadge = (status: string) => {
    switch (status) {
      case 'leading': return 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/25';
      case 'second':  return 'bg-violet-500/15 text-violet-400 border border-violet-500/25';
      case 'third':   return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25';
      default:        return 'bg-zinc-700/50 text-zinc-400 border border-zinc-700/50';
    }
  };

  return (
    <div className="bento-card p-4 sm:p-5">
      <h3 className="text-sm font-semibold text-zinc-100 mb-4">Live Results</h3>

      {/* Mobile View */}
      <div className="block md:hidden space-y-2">
        {rankings.map(({ candidate, rank, percentage, status }) => (
          <div key={candidate._id} className="bg-zinc-800/60 rounded-xl p-3 border border-zinc-700/50">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-zinc-100 truncate">
                  {candidate.name.split(' ')[0]}
                </h4>
                <p className="text-xs text-zinc-500">{candidate.category?.name || 'Unknown'}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${getRankBadge(status)}`}>
                {getRankDisplay(rank)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-violet-400">{candidate.voteCount}</span>
              <span className="text-sm text-zinc-400">{percentage.toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-700/50">
              <th className="text-left py-2.5 text-xs font-bold text-zinc-500 uppercase tracking-wider">Candidate</th>
              <th className="text-center py-2.5 text-xs font-bold text-zinc-500 uppercase tracking-wider">Category</th>
              <th className="text-center py-2.5 text-xs font-bold text-zinc-500 uppercase tracking-wider">Votes</th>
              <th className="text-center py-2.5 text-xs font-bold text-zinc-500 uppercase tracking-wider">%</th>
              <th className="text-right py-2.5 text-xs font-bold text-zinc-500 uppercase tracking-wider">Position</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map(({ candidate, rank, percentage, status }) => (
              <tr key={candidate._id} className="border-b border-zinc-800/80">
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      status === 'leading' ? 'bg-yellow-400' : 'bg-zinc-700'
                    }`} />
                    <span className="font-medium text-zinc-100">{candidate.name}</span>
                  </div>
                </td>
                <td className="text-center py-3 text-zinc-400">
                  {candidate.category?.name || 'Unknown'}
                </td>
                <td className="text-center py-3 font-bold text-violet-400">
                  {candidate.voteCount}
                </td>
                <td className="text-center py-3 text-zinc-400">
                  {percentage.toFixed(1)}%
                </td>
                <td className="text-right py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getRankBadge(status)}`}>
                    {getRankDisplay(rank)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
