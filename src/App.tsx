import React, { useState, useEffect } from 'react';
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
import { PWADebugUtility } from './shared/components/PWADebugUtility';

type ViewType = 'landing' | 'admin';
type VoterStepType = 'landing' | 'register' | 'verify' | 'success' | 'login' | 'vote';

function App() {
  const [view, setView] = useState<ViewType>('landing');
  const [voterStep, setVoterStep] = useState<VoterStepType>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [registrationDraft, setRegistrationDraft] = useState<RegistrationForm | null>(null);
  const [backPressCount, setBackPressCount] = useState(0);

  // Handle browser back button navigation (BUG 4 FIX)
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      
      // If not on landing page, go back to landing
      if (voterStep !== 'landing') {
        handleBackToLanding();
      } else {
        // On landing page - show exit confirmation on second press
        if (backPressCount === 0) {
          setBackPressCount(1);
          // Show toast or alert
          const toast = document.createElement('div');
          toast.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm';
          toast.textContent = 'Press back again to exit';
          document.body.appendChild(toast);
          setTimeout(() => {
            toast.remove();
            setBackPressCount(0);
          }, 2000);
          // Push state back so user stays on page
          window.history.pushState({ page: 'landing' }, '', '/');
        }
      }
    };

    // Push initial state
    if (voterStep !== 'landing') {
      window.history.pushState({ page: voterStep }, '', '/');
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [voterStep, backPressCount]);

  // Reset back press count when navigating
  useEffect(() => {
    setBackPressCount(0);
  }, [voterStep]);

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
            <div className="max-w-sm mx-auto mb-4 px-4">
              <button
                onClick={handleBackToLanding}
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1 min-h-[44px] bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm"
                aria-label="Back to Home"
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
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 flex flex-col min-h-[calc(100vh-5rem)]">
            <div className="max-w-sm mx-auto mb-4 px-4 w-full">
              <button
                onClick={handleBackToLanding}
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1 min-h-[44px] bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm"
                aria-label="Back to Home"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Home</span>
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <LoginPage onSuccess={handleLoginSuccess} />
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



  // Separate rendering for admin and landing views to prevent any overlap
  if (view === 'admin') {
    return (
      <NotificationProvider>
        <div className="min-h-screen bg-slate-900 font-sans relative selection:bg-blue-200">
          <AdminDashboard />
        </div>
      </NotificationProvider>
    );
  }

  // Landing/Voter view with Navigation
  return (
    <NotificationProvider>
      <div className="min-h-screen font-sans text-slate-900 relative selection:bg-blue-200">
        
        {/* Background System */}
        <div className="mesh-bg-light" />

        {/* Navigation */}
        <Navigation 
          view={view} 
          onViewChange={handleViewChange}
          isVisible={true}
        />

        {/* Main Content */}
        <main className="min-h-screen pt-16 sm:pt-20 pb-10 px-4 transition-colors duration-500">
          <div className="max-w-5xl mx-auto">
            {renderVoterFlow()}
          </div>
        </main>

        {/* PWA Debug Utility (only visible with ?pwa-debug=true) */}
        <PWADebugUtility />
      </div>
    </NotificationProvider>
  );
}

export default App;