import React, { useState } from 'react';
import { User, RegistrationForm } from './shared/types';
import { getStepStatus } from './shared/utils';
import { ROUTES } from './shared/constants';
import { NotificationProvider } from './shared/contexts/NotificationContext';
import { RegistrationPage } from './features/auth/RegistrationPage';
import { RegistrationSuccessPage } from './features/auth/RegistrationSuccessPage';
import { LoginPage } from './features/auth/LoginPage';
import { VerificationPage } from './features/verification/VerificationPage';
import { VotingBoothPage } from './features/voting/VotingBoothPage';
import { AdminDashboard } from './features/admin/AdminDashboard';
import { Navigation } from './shared/components/Navigation';
import { ProgressStepper } from './shared/components/ProgressStepper';

type ViewType = 'landing' | 'admin';
type StepType = 'register' | 'verify' | 'success' | 'login' | 'vote';

function App() {
  const [view, setView] = useState<ViewType>('landing');
  const [step, setStep] = useState<StepType>('register');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [registrationDraft, setRegistrationDraft] = useState<RegistrationForm | null>(null);
  const [showLoginOption, setShowLoginOption] = useState(true);

  const handleRegistrationProceed = (draft: RegistrationForm) => {
    setRegistrationDraft(draft);
    setStep('verify');
  };

  const handleVerificationSuccess = (user: User) => {
    setCurrentUser(user);
    setStep('success');
  };

  const handleRegistrationComplete = () => {
    setCurrentUser(null);
    setRegistrationDraft(null);
    setStep('login');
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setStep('vote');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setRegistrationDraft(null);
    setStep('login');
  };

  const handleSwitchToRegister = () => {
    setStep('register');
  };

  const handleSwitchToLogin = () => {
    setStep('login');
  };

  const renderVoterFlow = () => {
    switch (step) {
      case 'register':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <RegistrationPage
              onProceed={handleRegistrationProceed}
              onSuccess={handleVerificationSuccess}
            />
            {showLoginOption && (
              <div className="text-center mt-4">
                <button
                  onClick={handleSwitchToLogin}
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Already registered? Login to vote
                </button>
              </div>
            )}
          </div>
        );
      case 'verify':
        return registrationDraft ? (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <VerificationPage 
              draft={registrationDraft} 
              onVerified={handleVerificationSuccess} 
            />
          </div>
        ) : null;
      case 'success':
        return currentUser ? (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <RegistrationSuccessPage 
              user={currentUser} 
              onDone={handleRegistrationComplete}
            />
          </div>
        ) : null;
      case 'login':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <LoginPage onSuccess={handleLoginSuccess} />
            <div className="text-center mt-4">
              <button
                onClick={handleSwitchToRegister}
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
              >
                Not registered yet? Register here
              </button>
            </div>
          </div>
        );
      case 'vote':
        return currentUser ? (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <VotingBoothPage user={currentUser} onLogout={handleLogout} />
          </div>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <NotificationProvider>
      <div className="min-h-screen font-sans text-slate-900 relative selection:bg-blue-200">
        
        {/* Background System */}
        {view === 'admin' ? (
          <div className="fixed inset-0 bg-slate-900 z-[-1]" />
        ) : (
          <div className="mesh-bg-light" />
        )}

        {/* Navigation */}
        <Navigation 
          view={view} 
          onViewChange={setView}
          isVisible={view !== 'admin'}
        />

        {/* Main Content */}
        <main className={view === 'admin'
          ? 'min-h-screen pb-10 px-0 transition-colors duration-500'
          : 'min-h-screen pt-24 md:pt-32 pb-10 px-4 transition-colors duration-500'}>
          <div className={view === 'admin' ? 'w-full' : 'max-w-5xl mx-auto'}>
            
            {view === 'admin' ? (
              <AdminDashboard />
            ) : (
              <>
                {(step === 'register' || step === 'verify' || step === 'success') && (
                  <ProgressStepper 
                    currentStep={step === 'success' ? 'verify' : step}
                    getStepStatus={getStepStatus}
                  />
                )}
                {renderVoterFlow()}
              </>
            )}
          </div>
        </main>
      </div>
    </NotificationProvider>
  );
}

export default App;