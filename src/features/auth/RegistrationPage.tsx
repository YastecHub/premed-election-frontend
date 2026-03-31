import React, { useState } from 'react';
import { RegistrationFormComponent } from './components/RegistrationForm';
import { AccessCodeFormComponent } from './components/AccessCodeForm';
import { RegistrationForm, AccessCodeForm, User } from '../../shared/types';
import { authService } from '../../core/services/auth.service';
import { useNotification } from '../../shared/contexts/NotificationContext';

interface RegistrationPageProps {
  onProceed: (draft: RegistrationForm) => void;
  onSuccess?: (user: User) => void;
}

export const RegistrationPage: React.FC<RegistrationPageProps> = ({ onProceed, onSuccess }) => {
  const { showError } = useNotification();
  const [useAccessCode, setUseAccessCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegistrationSubmit = (data: RegistrationForm) => {
    setIsLoading(true);
    try {
      onProceed(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccessCodeSubmit = async (data: AccessCodeForm) => {
    setIsLoading(true);
    try {
      const user = await authService.loginWithCode(data);
      onSuccess?.(user);
    } catch (error: any) {
      showError(error.message || 'Access code login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto px-3 relative">
      <div className="hidden md:block absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="hidden md:block absolute -bottom-8 -left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      
      <div className="glass-panel relative rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-8 border-white/50 w-full">
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
            Register & Verify
          </h2>
          <p className="text-slate-500 mt-2 text-xs md:text-sm font-medium">
            Create your profile and verify your identity.
          </p>
        </div>

        {!useAccessCode ? (
          <>
            <RegistrationFormComponent 
              onSubmit={handleRegistrationSubmit}
              isLoading={isLoading}
            />
            <div className="mt-4 pt-4 border-t border-slate-200/50">
              <button
                type="button"
                onClick={() => setUseAccessCode(true)}
                className="w-full text-xs md:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors py-3 min-h-[44px]"
              >
                Have an Access Code? Use it here
              </button>
            </div>
          </>
        ) : (
          <>
            <AccessCodeFormComponent 
              onSubmit={handleAccessCodeSubmit}
              isLoading={isLoading}
            />
            <div className="mt-4 pt-4 border-t border-slate-200/50">
              <button
                type="button"
                onClick={() => setUseAccessCode(false)}
                className="w-full text-xs md:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors py-3 min-h-[44px]"
              >
                Use Matric Number Instead
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};