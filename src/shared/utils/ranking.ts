import { Candidate, CandidateRanking } from '../types';

export const calculateRankings = (candidates: Candidate[]): CandidateRanking[] => {
  const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);
  
  return candidates
    .sort((a, b) => b.voteCount - a.voteCount)
    .map((candidate, index) => ({
      candidate,
      rank: index + 1,
      percentage: totalVotes > 0 ? (candidate.voteCount / totalVotes) * 100 : 0,
      status: getRankStatus(index + 1)
    }));
};

export const getRankStatus = (rank: number): 'leading' | 'second' | 'third' | 'other' => {
  switch (rank) {
    case 1: return 'leading';
    case 2: return 'second';
    case 3: return 'third';
    default: return 'other';
  }
};

export const getRankDisplay = (rank: number): string => {
  switch (rank) {
    case 1: return 'Leading';
    case 2: return '2nd';
    case 3: return '3rd';
    default: return `${rank}th`;
  }
};