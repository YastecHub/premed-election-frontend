import React, { useState } from 'react';
import { IdentificationIcon } from '@heroicons/react/24/outline';
import { VALIDATION } from '../../shared/constants';
import { validateMatricNumber, formatMatricNumber } from '../../shared/utils';
import { useNotification } from '../../shared/contexts/NotificationContext';
import { authService } from '../../core/services/auth.service';
import { User } from '../../shared/types';

interface LoginPageProps {
  onSuccess: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { showError } = useNotification();
  const [matricNumber, setMatricNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateMatricNumber(matricNumber)) {
      showError(VALIDATION.MATRIC_NUMBER.ERROR_MESSAGE);
      return;
    }

    setIsLoading(true);
    try {
      const user = await authService.loginWithMatric(matricNumber);
      onSuccess(user);
    } catch (error: any) {
      showError(error.message || 'Login failed. Please check your matric number.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMatricChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatMatricNumber(e.target.value);
    if (formatted.length <= VALIDATION.MATRIC_NUMBER.LENGTH) {
      setMatricNumber(formatted);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto px-3 relative">
      <div className="hidden md:block absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="hidden md:block absolute -bottom-8 -left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      
      <div className="glass-panel relative rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-8 border-white/50 w-full">
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
            Voter Login
          </h2>
          <p className="text-slate-500 mt-2 text-xs md:text-sm font-medium">
            Enter your matric number to cast your vote
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="group">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">
              Matric Number
            </label>
            <div className="relative transition-all duration-300 focus-within:transform focus-within:-translate-y-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <IdentificationIcon className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                required
                maxLength={VALIDATION.MATRIC_NUMBER.LENGTH}
                className="pl-11 block w-full rounded-2xl border-slate-200 bg-white/50 border focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 py-3 shadow-sm text-slate-700 text-sm md:text-base transition-all outline-none font-mono tracking-wider"
                placeholder="230905024"
                value={matricNumber}
                onChange={handleMatricChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full mt-4 flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-blue-500/30 text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : (
              'Login to Vote'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
