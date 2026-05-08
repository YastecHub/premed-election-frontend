import React, { useState } from 'react';
import { RegistrationFormComponent } from './components/RegistrationForm';
import { RegistrationForm, User } from '../../shared/types';

interface RegistrationPageProps {
  onProceed: (draft: RegistrationForm) => void;
  onSuccess?: (user: User) => void;
}

export const RegistrationPage: React.FC<RegistrationPageProps> = ({ onProceed }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRegistrationSubmit = (data: RegistrationForm) => {
    setIsLoading(true);
    try {
      onProceed(data);
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
            For students not on the approved list. Verify with your ID document.
          </p>
        </div>

        <RegistrationFormComponent
          onSubmit={handleRegistrationSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
