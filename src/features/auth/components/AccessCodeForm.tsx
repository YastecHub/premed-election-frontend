import React, { useState } from 'react';
import { User, KeyRound } from 'lucide-react';
import { AccessCodeForm } from '../../../shared/types';
import { formatAccessCode } from '../../../shared/utils';
import { useNotification } from '../../../shared/contexts/NotificationContext';

interface AccessCodeFormProps {
  onSubmit: (data: AccessCodeForm) => void;
  isLoading?: boolean;
}

const inputClass =
  'block w-full rounded-xl bg-zinc-800 border border-zinc-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 pl-10 pr-4 py-3 text-zinc-100 placeholder-zinc-600 text-sm outline-none transition-all';

const labelClass = 'block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5';

export const AccessCodeFormComponent: React.FC<AccessCodeFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const { showError } = useNotification();
  const [formData, setFormData] = useState<AccessCodeForm>({ fullName: '', code: '' });

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
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Full Name */}
      <div>
        <label className={labelClass}>Full Name</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
          <input
            type="text"
            required
            className={inputClass}
            placeholder="John Doe"
            value={formData.fullName}
            onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
          />
        </div>
      </div>

      {/* Access Code */}
      <div>
        <label className={labelClass}>Access Code</label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
          <input
            type="text"
            required
            className={`${inputClass} font-mono tracking-widest`}
            placeholder="ABC-1234"
            value={formData.code}
            onChange={e => setFormData(prev => ({ ...prev, code: formatAccessCode(e.target.value) }))}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full mt-2 flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all active:scale-95 ${
          isLoading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing…
          </>
        ) : (
          'Login with Access Code'
        )}
      </button>
    </form>
  );
};
