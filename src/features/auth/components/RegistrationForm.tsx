import React, { useState } from 'react';
import { User, BookOpen, Hash, Mail } from 'lucide-react';
import { RegistrationForm as RegistrationFormData } from '../../../shared/types';
import { DEPARTMENTS, VALIDATION } from '../../../shared/constants';
import { validateMatricNumber, validateEmail, formatMatricNumber } from '../../../shared/utils';
import { useNotification } from '../../../shared/contexts/NotificationContext';

interface RegistrationFormProps {
  onSubmit: (data: RegistrationFormData) => void;
  isLoading?: boolean;
}

const inputClass =
  'block w-full rounded-xl bg-zinc-800 border border-zinc-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 pl-10 pr-4 py-3 text-zinc-100 placeholder-zinc-600 text-sm outline-none transition-all';

const labelClass = 'block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5';

export const RegistrationFormComponent: React.FC<RegistrationFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const { showError } = useNotification();
  const [formData, setFormData] = useState<RegistrationFormData>({
    matricNumber: '',
    fullName: '',
    department: DEPARTMENTS[0],
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateMatricNumber(formData.matricNumber)) {
      showError(VALIDATION.MATRIC_NUMBER.ERROR_MESSAGE);
      return;
    }
    if (!validateEmail(formData.email)) {
      showError(VALIDATION.EMAIL.ERROR_MESSAGE);
      return;
    }
    onSubmit(formData);
  };

  const handleMatricChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatMatricNumber(e.target.value);
    if (formatted.length <= VALIDATION.MATRIC_NUMBER.LENGTH) {
      setFormData(prev => ({ ...prev, matricNumber: formatted }));
    }
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

      {/* Email */}
      <div>
        <label className={labelClass}>Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
          <input
            type="email"
            required
            className={inputClass}
            placeholder="student@live.unilag.edu.ng"
            value={formData.email}
            onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
          />
        </div>
      </div>

      {/* Matric Number */}
      <div>
        <label className={labelClass}>Matric Number</label>
        <div className="relative">
          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
          <input
            type="text"
            required
            maxLength={VALIDATION.MATRIC_NUMBER.LENGTH}
            className={`${inputClass} font-mono tracking-widest`}
            placeholder="230905024"
            value={formData.matricNumber}
            onChange={handleMatricChange}
          />
        </div>
      </div>

      {/* Department */}
      <div>
        <label className={labelClass}>Department</label>
        <div className="relative">
          <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
          <select
            title="Select your department"
            className={`${inputClass} appearance-none cursor-pointer`}
            value={formData.department}
            onChange={e => setFormData(prev => ({ ...prev, department: e.target.value }))}
          >
            {DEPARTMENTS.map(dept => (
              <option key={dept} value={dept} className="bg-zinc-800 text-zinc-100">{dept}</option>
            ))}
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
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
            Processing…
          </>
        ) : (
          'Proceed to Verification'
        )}
      </button>
    </form>
  );
};
