import React from 'react';
import { UserGroupIcon, ShieldCheckIcon, ChartBarIcon } from '@heroicons/react/24/outline';

interface ProgressStepperProps {
  currentStep: string;
  getStepStatus: (currentStep: string, targetStep: string) => 'current' | 'complete' | 'upcoming';
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({ currentStep, getStepStatus }) => {
  return (
    <div className="mb-8 md:mb-12 max-w-xl mx-auto px-2">
      <div className="relative flex justify-between items-center">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10 transform -translate-y-1/2 rounded-full"></div>
        {/* Dynamic width progress bar */}
        <div className={`progress-indicator ${
          currentStep === 'register' ? 'progress-indicator-0' : 
          currentStep === 'verify' ? 'progress-indicator-50' : 
          'progress-indicator-100'
        }`}></div>

        {/* Step 1 - Register */}
        <div className="flex flex-col items-center group">
          <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 z-10 ${
            getStepStatus(currentStep, 'register') === 'complete' 
              ? 'bg-blue-600 border-blue-600 text-white' 
              : 'bg-white border-blue-600 text-blue-600 shadow-lg shadow-blue-500/20'
          }`}>
            <UserGroupIcon className="h-4 w-4 md:h-5 md:w-5" />
          </div>
          <span className="text-[10px] md:text-xs font-bold mt-2 text-slate-600 bg-white/60 px-2 rounded-md backdrop-blur-sm">
            Register
          </span>
        </div>

        {/* Step 2 - Verify */}
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 z-10 ${
            getStepStatus(currentStep, 'verify') === 'current' 
              ? 'bg-white border-blue-600 text-blue-600 shadow-lg shadow-blue-500/20 scale-110' : 
            getStepStatus(currentStep, 'verify') === 'complete' 
              ? 'bg-blue-600 border-blue-600 text-white' 
              : 'bg-slate-100 border-slate-200 text-slate-400'
          }`}>
            <ShieldCheckIcon className="h-4 w-4 md:h-5 md:w-5" />
          </div>
          <span className={`text-[10px] md:text-xs font-bold mt-2 px-2 rounded-md backdrop-blur-sm transition-colors ${
            getStepStatus(currentStep, 'verify') === 'upcoming' 
              ? 'text-slate-400' 
              : 'text-slate-600 bg-white/60'
          }`}>
            Verify
          </span>
        </div>

        {/* Step 3 - Vote */}
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 z-10 ${
            getStepStatus(currentStep, 'vote') === 'current' 
              ? 'bg-white border-green-500 text-green-500 shadow-lg shadow-green-500/20 scale-110' 
              : 'bg-slate-100 border-slate-200 text-slate-400'
          }`}>
            <ChartBarIcon className="h-4 w-4 md:h-5 md:w-5" />
          </div>
          <span className={`text-[10px] md:text-xs font-bold mt-2 px-2 rounded-md backdrop-blur-sm transition-colors ${
            currentStep === 'vote' 
              ? 'text-green-600 bg-white/60' 
              : 'text-slate-400'
          }`}>
            Vote
          </span>
        </div>
      </div>
    </div>
  );
};