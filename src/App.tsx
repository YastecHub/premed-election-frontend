import React, { useState } from 'react';
import { User, RegistrationForm } from './shared/types';
import { NotificationProvider } from './shared/contexts/NotificationContext';
import { VoterLandingPage } from './features/voter/VoterLandingPage';
import { RegistrationPage } from './features/auth/RegistrationPage';
import { RegistrationSuccessPage } from './features/auth/RegistrationSuccessPage';
import { LoginPage } from './features/auth/LoginPage';
import { VerificationPage } from './features/verification/VerificationPage';
import { VotingBoothPage } from './features/voting/VotingBoothPage';
import { AdminDashboard } from './features/admin/AdminDashboard';
import { Navigation } from './shared/components/Navigation';

type ViewType = 'landing' | 'admin';
type VoterStepType = 'landing' | 'register' | 'verify' | 'success' | 'login' | 'vote';

function App() {
  const [view, setView] = useState<ViewType>('landing');
  const [voterStep, setVoterStep] = useState<VoterStepType>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [registrationDraft, setRegistrationDraft] = useState<RegistrationForm | null>(null);

  const handleViewChange = (newView: ViewType) => {
    setView(newView);
    if (newView === 'landing') {
      setVoterStep('landing');
    }
  };

  const handleNavigateToRegister = () => {
    setVoterStep('register');
  };

  const handleNavigateToLogin = () => {
    setVoterStep('login');
  };

  const handleRegistrationProceed = (draft: RegistrationForm) => {
    setRegistrationDraft(draft);
    setVoterStep('verify');
  };

  const handleVerificationSuccess = (user: User) => {
    setCurrentUser(user);
    setVoterStep('success');
  };

  const handleRegistrationComplete = () => {
    setCurrentUser(null);
    setRegistrationDraft(null);
    setVoterStep('landing');
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setVoterStep('vote');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setRegistrationDraft(null);
    setVoterStep('landing');
  };

  const handleBackToLanding = () => {
    setVoterStep('landing');
  };

  const renderVoterFlow = () => {
    switch (voterStep) {
      case 'landing':
        return (
          <div className="animate-in fade-in zoom-in-95 duration-700">
            <VoterLandingPage
              onNavigateToRegister={handleNavigateToRegister}
              onNavigateToLogin={handleNavigateToLogin}
            />
          </div>
        );
      case 'register':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="max-w-sm mx-auto mb-4">
              <button
                onClick={handleBackToLanding}
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Home</span>
              </button>
            </div>
            <RegistrationPage
              onProceed={handleRegistrationProceed}
              onSuccess={handleVerificationSuccess}
            />
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
            <div className="max-w-sm mx-auto mb-4">
              <button
                onClick={handleBackToLanding}
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Home</span>
              </button>
            </div>
            <LoginPage onSuccess={handleLoginSuccess} />
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
          onViewChange={handleViewChange}
          isVisible={true}
        />

        {/* Main Content */}
        <main className={view === 'admin'
          ? 'min-h-screen pb-10 px-0 transition-colors duration-500'
          : 'min-h-screen pt-24 md:pt-32 pb-10 px-4 transition-colors duration-500'}>
          <div className={view === 'admin' ? 'w-full' : 'max-w-5xl mx-auto'}>
            
            {view === 'admin' ? (
              <AdminDashboard />
            ) : (
              renderVoterFlow()
            )}
          </div>
        </main>
      </div>
    </NotificationProvider>
  );
}

export default App;