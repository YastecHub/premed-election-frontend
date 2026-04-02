import React from 'react';
import { Users, ShieldCheck, BarChart3 } from 'lucide-react';

interface ProgressStepperProps {
  currentStep: string;
  getStepStatus: (currentStep: string, targetStep: string) => 'current' | 'complete' | 'upcoming';
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({ currentStep, getStepStatus }) => {
  return (
    <div className="mb-8 md:mb-10 max-w-xs mx-auto px-2">
      <div className="relative flex justify-between items-center">
        {/* Connecting line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-800 -z-10 -translate-y-1/2 rounded-full" />

        {/* Step 1 - Register */}
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all z-10 ${
            getStepStatus(currentStep, 'register') === 'complete'
              ? 'bg-violet-600 border-violet-600 text-white'
              : 'bg-zinc-900 border-violet-500 text-violet-400'
          }`}>
            <Users className="h-3.5 w-3.5" />
          </div>
          <span className="text-[10px] font-bold mt-1.5 text-zinc-500">Register</span>
        </div>

        {/* Step 2 - Verify */}
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all z-10 ${
            getStepStatus(currentStep, 'verify') === 'current'
              ? 'bg-zinc-900 border-violet-500 text-violet-400 scale-110'
              : getStepStatus(currentStep, 'verify') === 'complete'
              ? 'bg-violet-600 border-violet-600 text-white'
              : 'bg-zinc-900 border-zinc-700 text-zinc-600'
          }`}>
            <ShieldCheck className="h-3.5 w-3.5" />
          </div>
          <span className={`text-[10px] font-bold mt-1.5 ${
            getStepStatus(currentStep, 'verify') === 'upcoming' ? 'text-zinc-600' : 'text-zinc-500'
          }`}>
            Verify
          </span>
        </div>

        {/* Step 3 - Vote */}
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all z-10 ${
            getStepStatus(currentStep, 'vote') === 'current'
              ? 'bg-zinc-900 border-emerald-500 text-emerald-400 scale-110'
              : 'bg-zinc-900 border-zinc-700 text-zinc-600'
          }`}>
            <BarChart3 className="h-3.5 w-3.5" />
          </div>
          <span className={`text-[10px] font-bold mt-1.5 ${
            currentStep === 'vote' ? 'text-emerald-400' : 'text-zinc-600'
          }`}>
            Vote
          </span>
        </div>
      </div>
    </div>
  );
};
