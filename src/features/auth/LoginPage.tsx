import React, { useState } from 'react';
import { Fingerprint } from 'lucide-react';
import { VALIDATION } from '../../shared/constants';
import { validateMatricNumber, formatMatricNumber } from '../../shared/utils';
import { useNotification } from '../../shared/contexts/NotificationContext';
import { authService } from '../../core/services/auth.service';
import { User } from '../../shared/types';

interface LoginPageProps {
  onSuccess: (user: User) => void;
  onNavigateToRegister?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onNavigateToRegister }) => {
  const { showError } = useNotification();
  const [matricNumber, setMatricNumber] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateMatricNumber(matricNumber)) {
      showError(VALIDATION.MATRIC_NUMBER.ERROR_MESSAGE);
      return;
    }
    if (!lastName.trim()) {
      showError('Please enter your last name.');
      return;
    }
    setIsLoading(true);
    try {
      const user = await authService.loginWithMatricAndName(matricNumber, lastName.trim());
      onSuccess(user);
    } catch (error: any) {
      showError(error.message || 'Login failed. Please check your matric number and last name.');
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
    <div className="w-[92%] max-w-sm mx-auto">
      <div className="bento-card p-5 sm:p-7">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-violet-500/15 border border-violet-500/20 mb-4">
            <Fingerprint className="h-6 w-6 text-violet-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-100">
            Voter Login
          </h2>
          <p className="text-zinc-400 mt-1.5 text-xs sm:text-sm">
            Enter your matric number and last name to cast your vote
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
              Matric Number
            </label>
            <input
              type="text"
              required
              maxLength={VALIDATION.MATRIC_NUMBER.LENGTH}
              className="block w-full rounded-xl bg-zinc-800 border border-zinc-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 px-4 py-3 text-zinc-100 placeholder-zinc-600 text-sm font-mono tracking-widest outline-none transition-all"
              placeholder="251106001"
              value={matricNumber}
              onChange={handleMatricChange}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
              Last Name
            </label>
            <input
              type="text"
              required
              autoComplete="family-name"
              className="block w-full rounded-xl bg-zinc-800 border border-zinc-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 px-4 py-3 text-zinc-100 placeholder-zinc-600 text-sm outline-none transition-all"
              placeholder="e.g. Adegoke"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <p className="mt-1.5 text-[11px] text-zinc-500">
              As it appears on the official student list.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full mt-2 flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-violet-600 hover:bg-violet-500 shadow-lg shadow-violet-500/20 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all active:scale-95 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Logging in…
              </>
            ) : (
              'Login to Vote'
            )}
          </button>

          {onNavigateToRegister && (
            <p className="text-center text-xs text-zinc-500 pt-1">
              Not on the approved list?{' '}
              <button
                type="button"
                onClick={onNavigateToRegister}
                className="text-violet-400 hover:text-violet-300 font-semibold underline-offset-2 hover:underline transition-colors"
              >
                Register manually
              </button>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
