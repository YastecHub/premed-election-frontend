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
    <div className="w-[92%] max-w-sm mx-auto">
      <div className="bento-card p-5 sm:p-7">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-100">
            Register &amp; Verify
          </h2>
          <p className="text-zinc-400 mt-1.5 text-xs sm:text-sm">
            Create your profile and verify your identity.
          </p>
        </div>

        {!useAccessCode ? (
          <>
            <RegistrationFormComponent
              onSubmit={handleRegistrationSubmit}
              isLoading={isLoading}
            />
            <div className="mt-4 pt-4 border-t border-zinc-700/50">
              <button
                type="button"
                onClick={() => setUseAccessCode(true)}
                className="w-full text-xs sm:text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors py-3 min-h-[44px]"
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
            <div className="mt-4 pt-4 border-t border-zinc-700/50">
              <button
                type="button"
                onClick={() => setUseAccessCode(false)}
                className="w-full text-xs sm:text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors py-3 min-h-[44px]"
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
