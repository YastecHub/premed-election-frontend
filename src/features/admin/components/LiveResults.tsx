import React from 'react';
import { CandidateRanking } from '../../../shared/types';
import { getRankDisplay } from '../../../shared/utils/ranking';

interface LiveResultsProps {
  rankings: CandidateRanking[];
}

export const LiveResults: React.FC<LiveResultsProps> = ({ rankings }) => {
  const getRankColor = (status: string) => {
    switch (status) {
      case 'leading': return 'bg-yellow-900 text-yellow-200';
      case 'second': return 'bg-blue-900 text-blue-200';
      case 'third': return 'bg-green-900 text-green-200';
      default: return 'bg-slate-700 text-slate-300';
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 md:p-6">
      <h3 className="text-lg font-semibold mb-4 text-white">Live Results</h3>
      
      {/* Mobile View */}
      <div className="block md:hidden space-y-3">
        {rankings.map(({ candidate, rank, percentage, status }) => (
          <div key={candidate._id} className="bg-slate-700 rounded-lg p-3">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-white truncate">
                  {candidate.name.split(' ')[0]}
                </h4>
                <p className="text-xs text-slate-400">{candidate.category?.name || 'Unknown'}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${getRankColor(status)}`}>
                {getRankDisplay(rank)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-blue-400">{candidate.voteCount}</span>
              <span className="text-sm text-slate-300">{percentage.toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-2 text-slate-300">Candidate</th>
              <th className="text-center py-2 text-slate-300">Category</th>
              <th className="text-center py-2 text-slate-300">Votes</th>
              <th className="text-center py-2 text-slate-300">%</th>
              <th className="text-right py-2 text-slate-300">Position</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map(({ candidate, rank, percentage, status }) => (
              <tr key={candidate._id} className="border-b border-slate-700/50">
                <td className="py-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      status === 'leading' ? 'bg-yellow-400' : 'bg-slate-600'
                    }`}></div>
                    <span className="font-medium text-white">{candidate.name}</span>
                  </div>
                </td>
                <td className="text-center py-3 text-slate-300">
                  {candidate.category?.name || 'Unknown'}
                </td>
                <td className="text-center py-3 font-bold text-blue-400">
                  {candidate.voteCount}
                </td>
                <td className="text-center py-3 text-slate-300">
                  {percentage.toFixed(1)}%
                </td>
                <td className="text-right py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${getRankColor(status)}`}>
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