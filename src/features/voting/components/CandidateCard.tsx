import React from 'react';
import { ThumbsUp, Star } from 'lucide-react';
import { Candidate } from '../../../shared/types';

interface CandidateCardProps {
  candidate: Candidate;
  isSelected: boolean;
  onSelect: (candidateId: string) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  isSelected,
  onSelect,
}) => {
  const categoryLabel = candidate.category?.name ?? candidate.department;

  return (
    <button
      type="button"
      onClick={() => onSelect(candidate._id)}
      className={`
        relative group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 text-left w-full
        ${isSelected
          ? 'ring-2 ring-violet-500 ring-offset-2 ring-offset-zinc-950 scale-[1.02] shadow-2xl shadow-violet-500/20'
          : 'bento-card hover:scale-[1.01]'
        }
      `}
    >
      {/* Colour header strip */}
      <div className={`h-24 sm:h-28 ${candidate.color} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        {isSelected && (
          <div className="absolute inset-0 bg-violet-500/20" />
        )}
      </div>

      {/* Avatar */}
      <div className="flex justify-center -mt-12 relative z-10">
        <div className={`p-1 rounded-full transition-transform duration-300 ${
          isSelected ? 'bg-violet-500 scale-110' : 'bg-zinc-800'
        }`}>
          <img
            src={candidate.photoUrl}
            alt={candidate.name}
            className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover border-2 border-zinc-700"
          />
        </div>

        {/* Selected badge */}
        {isSelected && (
          <div className="absolute bottom-0 right-1/3 translate-x-8 bg-violet-600 text-white p-1.5 rounded-full shadow-lg border-2 border-zinc-950 animate-in zoom-in spin-in-12">
            <ThumbsUp className="h-4 w-4" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="pt-3 pb-6 px-5 text-center bg-zinc-900">
        <h3 className={`text-base sm:text-lg font-extrabold leading-tight line-clamp-2 transition-colors duration-200 ${
          isSelected ? 'text-violet-300' : 'text-zinc-100'
        }`}>
          {candidate.name}
        </h3>

        <span className="inline-block mt-1.5 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          {categoryLabel}
        </span>

        <div className="mt-1.5">
          <span className="inline-block bg-zinc-800 text-zinc-400 text-xs px-2.5 py-0.5 rounded-full border border-zinc-700/50">
            {candidate.department}
          </span>
        </div>

        {/* Manifesto */}
        <div className="mt-4 relative">
          <Star className="h-3.5 w-3.5 text-amber-400 absolute -top-2 -left-1 opacity-60 -rotate-12" />
          <div className="bg-zinc-800/60 border border-zinc-700/50 rounded-xl p-3 text-xs text-zinc-400 italic leading-relaxed line-clamp-4">
            "{candidate.manifesto}"
          </div>
        </div>
      </div>
    </button>
  );
};
