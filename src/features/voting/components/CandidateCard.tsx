import React from 'react';
import { HandThumbUpIcon, StarIcon } from '@heroicons/react/24/solid';
import { Candidate } from '../../../shared/types';

interface CandidateCardProps {
  candidate: Candidate;
  isSelected: boolean;
  onSelect: (candidateId: string) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({ 
  candidate, 
  isSelected, 
  onSelect 
}) => {
  return (
    <div 
      onClick={() => onSelect(candidate._id)}
      className={`
        relative group rounded-3xl overflow-hidden cursor-pointer transition-all duration-500
        ${isSelected 
          ? 'ring-4 ring-blue-500 ring-offset-4 ring-offset-slate-50 transform scale-[1.03] shadow-2xl z-10' 
          : 'bg-white shadow-xl hover:shadow-2xl hover:-translate-y-2 border border-white/50'
        }
      `}
    >
      <div className={`h-32 md:h-40 ${candidate.color} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10"></div>
      </div>
      
      <div className="flex justify-center -mt-16 relative z-10">
        <div className={`p-1.5 rounded-full bg-white shadow-lg ${isSelected ? 'scale-110 transition-transform duration-300' : ''}`}>
          <img 
            src={candidate.photoUrl} 
            alt={candidate.name} 
            className="h-28 w-28 md:h-32 md:w-32 rounded-full object-cover border-4 border-slate-50"
          />
        </div>
        {isSelected && (
          <div className="absolute bottom-0 right-1/3 translate-x-8 bg-blue-600 text-white p-2 rounded-full shadow-lg border-4 border-white animate-in zoom-in spin-in-12">
            <HandThumbUpIcon className="h-5 w-5 md:h-6 md:w-6" />
          </div>
        )}
      </div>
      
      <div className="pt-4 pb-8 px-6 md:px-8 text-center bg-white">
        <h3 className="text-xl md:text-2xl font-extrabold text-slate-800 leading-tight line-clamp-2">
          {candidate.name}
        </h3>
        <p className="text-blue-600 font-bold text-xs md:text-sm tracking-wide uppercase mt-1 opacity-80">
          {candidate.position}
        </p>
        
        <div className="mt-2 inline-block">
          <span className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full border border-purple-200">
            {candidate.department}
          </span>
        </div>
        
        <div className="mt-6 relative">
          <StarIcon className="h-5 w-5 md:h-6 md:w-6 text-yellow-400 absolute -top-3 -left-2 opacity-50 transform -rotate-12" />
          <div className="bg-slate-50 p-4 rounded-2xl text-sm text-slate-600 italic leading-relaxed border border-slate-100 shadow-inner line-clamp-4">
            "{candidate.manifesto}"
          </div>
        </div>
      </div>
    </div>
  );
};