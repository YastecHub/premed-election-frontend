import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';
import { AdminLoginForm } from '../../../shared/types';
import { useNotification } from '../../../shared/contexts/NotificationContext';

interface AdminLoginProps {
  onSubmit: (data: AdminLoginForm) => void;
  isLoading?: boolean;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSubmit, isLoading = false }) => {
  const { showError } = useNotification();
  const [formData, setFormData] = useState<AdminLoginForm>({
    username: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username.trim()) {
      showError('Please enter your username.');
      return;
    }
    
    if (!formData.password.trim()) {
      showError('Please enter your password.');
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-3 md:p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm md:max-w-md p-6 md:p-8 border border-slate-700">
        <div className="text-center mb-6 md:mb-8">
          <div className="h-10 w-10 md:h-12 md:w-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md mx-auto mb-3 md:mb-4">
            A
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white">Admin Portal</h2>
          <p className="text-slate-400 mt-2 text-xs md:text-sm">Sign in to access the dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 md:h-5 md:w-5 text-slate-400" />
              </div>
              <input
                type="text"
                required
                className="pl-8 md:pl-10 block w-full rounded-lg border-slate-600 bg-slate-700 border focus:bg-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 py-3 shadow-sm text-white text-sm transition-all outline-none min-h-[44px]"
                placeholder="admin"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 md:h-5 md:w-5 text-slate-400" />
              </div>
              <input
                type="password"
                required
                className="pl-8 md:pl-10 block w-full rounded-lg border-slate-600 bg-slate-700 border focus:bg-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 py-3 shadow-sm text-white text-sm transition-all outline-none min-h-[44px]"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};