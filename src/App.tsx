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
        <div className="min-h-screen bg-zinc-950 font-sans relative selection:bg-violet-500/30">
          <AdminDashboard />
        </div>
      </NotificationProvider>
    );
  }

  // Landing/Voter view with Navigation
  return (
    <NotificationProvider>
      <div className="min-h-screen dot-bg font-sans text-zinc-100 relative selection:bg-violet-500/30">

        {/* Navigation */}
        <Navigation
          view={view}
          onViewChange={handleViewChange}
          isVisible={true}
        />

        {/* Main Content */}
        <main className="relative z-10 min-h-screen pt-16 sm:pt-20 pb-safe pb-10 px-4 transition-colors duration-500">
          <div className="max-w-5xl mx-auto">
            {renderVoterFlow()}
          </div>
        </main>

        {/* Mobile Bottom Dock — voter/admin switcher */}
        <div className="fixed bottom-0 left-0 right-0 z-50 block md:hidden">
          <div className="bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-700/50 flex safe-area-pb">
            <button
              onClick={() => handleViewChange('landing')}
              type="button"
              className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 text-[10px] font-semibold transition-colors ${
                view === 'landing' ? 'text-violet-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Voter</span>
              {view === 'landing' && <div className="w-1 h-1 rounded-full bg-violet-400" />}
            </button>
            <button
              onClick={() => handleViewChange('admin')}
              className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 text-[10px] font-semibold transition-colors ${
                view === 'admin' ? 'text-violet-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Admin</span>
              {view === 'admin' && <div className="w-1 h-1 rounded-full bg-violet-400" />}
            </button>
          </div>
        </div>

        {/* PWA Debug Utility (only visible with ?pwa-debug=true) */}
        <PWADebugUtility />
      </div>
    </NotificationProvider>
  );
}

export default App;