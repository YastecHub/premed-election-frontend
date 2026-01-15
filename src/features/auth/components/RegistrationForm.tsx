import React, { useState } from 'react';
import { UserIcon, BuildingLibraryIcon, IdentificationIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { RegistrationForm as RegistrationFormData } from '../../../shared/types';
import { DEPARTMENTS, VALIDATION } from '../../../shared/constants';
import { validateMatricNumber, validateEmail, formatMatricNumber } from '../../../shared/utils';
import { useNotification } from '../../../shared/contexts/NotificationContext';

interface RegistrationFormProps {
  onSubmit: (data: RegistrationFormData) => void;
  isLoading?: boolean;
}

export const RegistrationFormComponent: React.FC<RegistrationFormProps> = ({ 
  onSubmit, 
  isLoading = false 
}) => {
  const { showError } = useNotification();
  const [formData, setFormData] = useState<RegistrationFormData>({
    matricNumber: '',
    fullName: '',
    department: DEPARTMENTS[0],
    email: ''
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
          Email Address
        </label>
        <div className="relative transition-all duration-300 focus-within:transform focus-within:-translate-y-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <EnvelopeIcon className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="email"
            required
            className="pl-11 block w-full rounded-2xl border-slate-200 bg-white/50 border focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 py-3 shadow-sm text-slate-700 text-sm md:text-base transition-all outline-none"
            placeholder="student@live.unilag.edu.ng"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          />
        </div>
      </div>

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
            value={formData.matricNumber}
            onChange={handleMatricChange}
          />
        </div>
      </div>

      <div className="group">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">
          Department
        </label>
        <div className="relative transition-all duration-300 focus-within:transform focus-within:-translate-y-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <BuildingLibraryIcon className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <select
            title="Select your department"
            className="pl-11 block w-full rounded-2xl border-slate-200 bg-white/50 border focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 py-3 shadow-sm text-slate-700 text-sm md:text-base transition-all outline-none appearance-none cursor-pointer"
            value={formData.department}
            onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
          >
            {DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
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
            Processing...
          </span>
        ) : (
          'Proceed to Verification'
        )}
      </button>
    </form>
  );
};