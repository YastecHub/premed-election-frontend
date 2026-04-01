import React, { useState } from 'react';
import { User, Lock, Shield } from 'lucide-react';
import { AdminLoginForm } from '../../../shared/types';
import { useNotification } from '../../../shared/contexts/NotificationContext';

interface AdminLoginProps {
  onSubmit: (data: AdminLoginForm) => void;
  isLoading?: boolean;
}

const inputClass =
  'block w-full rounded-xl bg-zinc-800 border border-zinc-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 pl-10 pr-4 py-3 text-zinc-100 placeholder-zinc-600 text-sm outline-none transition-all min-h-[44px]';

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSubmit, isLoading = false }) => {
  const { showError } = useNotification();
  const [formData, setFormData] = useState<AdminLoginForm>({ username: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username.trim()) { showError('Please enter your username.'); return; }
    if (!formData.password.trim()) { showError('Please enter your password.'); return; }
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen dot-bg flex items-center justify-center p-4">
      <div className="w-[92%] max-w-sm mx-auto">
        <div className="bento-card p-6 sm:p-8">

          {/* Header */}
          <div className="text-center mb-7">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-violet-500/15 border border-violet-500/20 mb-4 shadow-lg shadow-violet-500/10">
              <Shield className="h-7 w-7 text-violet-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-100">Admin Portal</h2>
            <p className="text-zinc-400 mt-1.5 text-xs sm:text-sm">Sign in to access the dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                <input
                  type="text"
                  required
                  className={inputClass}
                  placeholder="admin"
                  value={formData.username}
                  onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                <input
                  type="password"
                  required
                  className={inputClass}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>
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
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
