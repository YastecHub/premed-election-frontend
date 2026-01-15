import React, { useState } from 'react';
import { UserIcon, IdentificationIcon } from '@heroicons/react/24/outline';
import { AccessCodeForm } from '../../../shared/types';
import { formatAccessCode } from '../../../shared/utils';
import { useNotification } from '../../../shared/contexts/NotificationContext';

interface AccessCodeFormProps {
  onSubmit: (data: AccessCodeForm) => void;
  isLoading?: boolean;
}

export const AccessCodeFormComponent: React.FC<AccessCodeFormProps> = ({ 
  onSubmit, 
  isLoading = false 
}) => {
  const { showError } = useNotification();
  const [formData, setFormData] = useState<AccessCodeForm>({
    fullName: '',
    code: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName.trim()) {
      showError('Please enter your full name.');
      return;
    }
    
    if (!formData.code.trim()) {
      showError('Please enter your access code.');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="group">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">
          Full Name
        </label>
        <div className="relative transition-all duration-300 focus-within:transform focus-within:-translate-y-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <UserIcon className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            required
            className="pl-11 block w-full rounded-2xl border-slate-200 bg-white/50 border focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 py-3 shadow-sm text-slate-700 text-sm md:text-base transition-all outline-none"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
          />
        </div>
      </div>

      <div className="group">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">
          Access Code
        </label>
        <div className="relative transition-all duration-300 focus-within:transform focus-within:-translate-y-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <IdentificationIcon className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            required
            className="pl-11 block w-full rounded-2xl border-slate-200 bg-white/50 border focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 py-3 shadow-sm text-slate-700 text-sm md:text-base transition-all outline-none font-mono tracking-widest"
            placeholder="ABC-1234"
            value={formData.code}
            onChange={(e) => setFormData(prev => ({ ...prev, code: formatAccessCode(e.target.value) }))}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full mt-4 flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-green-500/30 text-sm font-bold text-white bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-500 hover:to-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
          isLoading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          'Login with Access Code'
        )}
      </button>
    </form>
  );
};