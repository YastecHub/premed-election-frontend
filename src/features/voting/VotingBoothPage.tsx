import React, { useEffect, useState } from 'react';
import { User, Candidate, ApiError } from '../../shared/types';
import { votingService } from '../../core/services/voting.service';
import { useElection } from '../../shared/hooks/useElection';
import { useNotification } from '../../shared/contexts/NotificationContext';
import { CandidateCard } from './components/CandidateCard';
import { VoteConfirmationModal } from './components/VoteConfirmationModal';
import { ElectionStatusScreen } from './components/ElectionStatusScreen';
import { CountdownTimer } from '../../shared/components/CountdownTimer';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';

interface VotingBoothPageProps {
  user: User;
  onLogout: () => void;
}

import { LoadingSpinner } from '../../shared/components/LoadingSpinner';

export const VotingBoothPage: React.FC<VotingBoothPageProps> = ({ user, onLogout }) => {
  const { showError } = useNotification();
  const electionState = useElection();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(user.hasVoted);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Delay API call to not block initial render
    const timer = setTimeout(() => {
      votingService.getCandidates()
        .then(setCandidates)
        .catch(e => showError(e.message || 'Failed to load candidates. Please refresh the page.'))
        .finally(() => setIsLoading(false));
    }, 200);

    return () => clearTimeout(timer);
  }, [showError]);

  const handleVoteClick = () => {
    if (!selectedCandidate) return;
    setShowConfirmation(true);
  };

  const confirmVote = async () => {
    if (!selectedCandidate) return;
    setIsSubmitting(true);
    try {
      const result = await votingService.castVote(user._id, selectedCandidate);
      if (result.success) {
        setShowConfirmation(false);
        setHasVoted(true);
      } else {
        showError(result.message);
        setShowConfirmation(false);
      }
    } catch (e: any) {
      const error = e as ApiError;
      if (error.code === 'IP_BLACKLISTED' || error.message?.includes('already voted from this device')) {
        showError('You have already voted from this device/network. Each device can only vote once during this election.');
      } else {
        showError(error.message || 'Failed to cast vote. Please try again.');
      }
      setShowConfirmation(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCandidateData = candidates.find(c => c._id === selectedCandidate);

  // Show loading while fetching candidates
  if (isLoading) {
    return (
      <div className="glass-panel rounded-3xl p-8 text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">Loading Ballot...</h2>
        <LoadingSpinner />
      </div>
    );
  }

  // Show status screens for non-voting states
  if (hasVoted || electionState.status === 'paused' || electionState.status === 'ended') {
    return (
      <ElectionStatusScreen 
        user={{ ...user, hasVoted }}
        electionState={electionState}
        onLogout={onLogout}
      />
    );
  }

  return (
    <div className="pb-32 relative">
      <div className="glass-panel rounded-3xl p-6 mb-8 flex flex-col md:flex-row justify-between items-center shadow-lg border-white/60 text-center md:text-left gap-4">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
            Official Ballot
          </h1>
          <p className="text-slate-500 font-medium text-sm md:text-base">
            Select your choice for <span className="text-blue-600">Pre-Med Governor</span>
          </p>
        </div>
        
        {electionState.endTime && (
          <div className="w-full md:w-auto md:min-w-[250px]">
            <CountdownTimer 
              targetDate={electionState.endTime}
              isActive={electionState.isActive}
              isPaused={electionState.isPaused}
            />
          </div>
        )}
        
        <div className="flex items-center space-x-3 bg-white/50 px-4 py-2 rounded-2xl border border-white shadow-sm shrink-0">
          <div className="h-2 w-2 bg-emerald-500 rounded-full animate-ping"></div>
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Security Active</div>
            <div className="text-xs font-bold text-emerald-600">Anti-Fraud Enabled</div>
          </div>
          <ShieldCheckIcon className="h-8 w-8 text-emerald-500 opacity-80" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {candidates.map((candidate) => (
          <CandidateCard
            key={candidate._id}
            candidate={candidate}
            isSelected={selectedCandidate === candidate._id}
            onSelect={setSelectedCandidate}
          />
        ))}
      </div>

      <div className="fixed bottom-8 left-0 right-0 flex justify-center z-40 pointer-events-none px-4">
        <div className="pointer-events-auto transition-all duration-500 transform w-full md:w-auto">
          <button
            onClick={handleVoteClick}
            disabled={!selectedCandidate || isSubmitting}
            className={`
              w-full md:w-auto px-8 md:px-10 py-4 md:py-5 rounded-full text-base md:text-lg font-bold text-white shadow-2xl transition-all duration-300 flex items-center justify-center space-x-3
              ${!selectedCandidate
                ? 'bg-slate-400 cursor-not-allowed translate-y-20 opacity-0' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:scale-105 active:scale-95 translate-y-0 opacity-100'
              }
            `}
          >
            <span>Review Selection & Vote</span>
          </button>
        </div>
      </div>

      <VoteConfirmationModal
        isOpen={showConfirmation}
        candidate={selectedCandidateData || null}
        isSubmitting={isSubmitting}
        onConfirm={confirmVote}
        onCancel={() => setShowConfirmation(false)}
      />
    </div>
  );
};