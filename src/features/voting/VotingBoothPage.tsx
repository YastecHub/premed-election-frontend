import React, { useEffect, useState } from 'react';
import { User, Candidate, Category, ApiError } from '../../shared/types';
import { votingService } from '../../core/services/voting.service';
import { categoryService } from '../../core/services/category.service';
import { useElection } from '../../shared/hooks/useElection';
import { useNotification } from '../../shared/contexts/NotificationContext';
import { CandidateCard } from './components/CandidateCard';
import { VoteConfirmationModal } from './components/VoteConfirmationModal';
import { ElectionStatusScreen } from './components/ElectionStatusScreen';
import { CountdownTimer } from '../../shared/components/CountdownTimer';
import { LoadingSpinner } from '../../shared/components/LoadingSpinner';
import { ShieldCheck, ChevronDown } from 'lucide-react';

interface VotingBoothPageProps {
  user: User;
  onLogout: () => void;
}

export const VotingBoothPage: React.FC<VotingBoothPageProps> = ({ user, onLogout }) => {
  const { showError } = useNotification();
  const electionState = useElection();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(user.hasVoted);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      Promise.all([
        votingService.getCandidates(),
        categoryService.getCategories(),
      ])
        .then(([candidatesData, categoriesData]) => {
          setCandidates(candidatesData);
          setCategories(categoriesData);
        })
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
      showError(error.message || 'Failed to cast vote. Please try again.');
      setShowConfirmation(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCandidateData = candidates.find(c => c._id === selectedCandidate);

  if (isLoading) {
    return (
      <div className="glass-dark rounded-2xl p-8 text-center max-w-md mx-auto border border-zinc-700/50">
        <p className="text-zinc-300 font-semibold mb-4 text-sm uppercase tracking-wider">Loading Ballot…</p>
        <LoadingSpinner />
      </div>
    );
  }

  if (hasVoted || electionState.status === 'not_started' || electionState.status === 'paused' || electionState.status === 'ended') {
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

      {/* Ballot header */}
      <div className="glass-dark rounded-2xl p-4 sm:p-5 mb-8 border border-zinc-700/50 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          {/* Title */}
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-100 tracking-tight">
              Official Ballot
            </h1>
            <p className="text-zinc-400 text-sm mt-0.5">
              Select your candidate for each position below
            </p>
          </div>

          {/* Countdown */}
          {electionState.endTime && (
            <div className="w-full sm:w-auto sm:min-w-[220px]">
              <CountdownTimer
                targetDate={electionState.endTime}
                isActive={electionState.isActive}
                isPaused={electionState.isPaused}
              />
            </div>
          )}

          {/* Security badge */}
          <div className="hidden md:flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl shrink-0">
            <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
            <div>
              <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Anti-Fraud</p>
              <p className="text-[10px] text-emerald-400">Active</p>
            </div>
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Candidates grouped by category */}
      <div className="space-y-10">
        {categories.map(category => {
          const categoryCandidates = candidates.filter(c => c.categoryId === category._id);
          if (categoryCandidates.length === 0) return null;

          return (
            <section key={category._id}>
              {/* Category heading */}
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px flex-1 bg-zinc-800" />
                <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-widest whitespace-nowrap">
                  {category.name}
                </h2>
                <div className="h-px flex-1 bg-zinc-800" />
              </div>

              {category.description && (
                <p className="text-zinc-500 text-sm text-center mb-4">{category.description}</p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {categoryCandidates.map(candidate => (
                  <CandidateCard
                    key={candidate._id}
                    candidate={candidate}
                    isSelected={selectedCandidate === candidate._id}
                    onSelect={setSelectedCandidate}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Scroll hint when a candidate is selected */}
      {selectedCandidate && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 text-xs text-zinc-500 pointer-events-none animate-bounce">
          <ChevronDown className="h-3.5 w-3.5" />
          <span>Scroll to vote button</span>
        </div>
      )}

      {/* Fixed Vote CTA */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-40 px-4 pointer-events-none">
        <div className={`pointer-events-auto transition-all duration-500 w-full max-w-sm ${
          selectedCandidate ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
        }`}>
          <button
            type="button"
            onClick={handleVoteClick}
            disabled={!selectedCandidate || isSubmitting}
            className="w-full py-4 rounded-2xl font-bold text-white bg-violet-600 hover:bg-violet-500 active:scale-95 shadow-2xl shadow-violet-500/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting…' : 'Review Selection & Vote'}
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
