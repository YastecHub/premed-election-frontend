import { useState, useEffect } from 'react';
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
import { ChevronLeft } from 'lucide-react';

type ViewType = 'landing' | 'admin';
type VoterStepType = 'landing' | 'register' | 'verify' | 'success' | 'login' | 'vote';

function App() {
  // --- State with sessionStorage persistence (survives page refresh) ---
  const [view, setView] = useState<ViewType>(() => {
    const saved = sessionStorage.getItem('elec_view');
    return (saved === 'admin' ? 'admin' : 'landing') as ViewType;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try { return JSON.parse(sessionStorage.getItem('elec_user') || 'null'); }
    catch { return null; }
  });

  const [registrationDraft, setRegistrationDraft] = useState<RegistrationForm | null>(() => {
    try { return JSON.parse(sessionStorage.getItem('elec_draft') || 'null'); }
    catch { return null; }
  });

  const [voterStep, setVoterStep] = useState<VoterStepType>(() => {
    const step = sessionStorage.getItem('elec_voter_step') as VoterStepType;
    if (!step || step === 'landing') return 'landing';
    // Guard against orphaned steps if dependent data was cleared
    if ((step === 'vote' || step === 'success') && !sessionStorage.getItem('elec_user')) return 'landing';
    if (step === 'verify' && !sessionStorage.getItem('elec_draft')) return 'landing';
    return step;
  });

  const [backPressCount, setBackPressCount] = useState(0);

  // --- Sync state to sessionStorage ---
  useEffect(() => { sessionStorage.setItem('elec_view', view); }, [view]);
  useEffect(() => { sessionStorage.setItem('elec_voter_step', voterStep); }, [voterStep]);
  useEffect(() => {
    if (currentUser) sessionStorage.setItem('elec_user', JSON.stringify(currentUser));
    else sessionStorage.removeItem('elec_user');
  }, [currentUser]);
  useEffect(() => {
    if (registrationDraft) sessionStorage.setItem('elec_draft', JSON.stringify(registrationDraft));
    else sessionStorage.removeItem('elec_draft');
  }, [registrationDraft]);

  // Establish initial history entry once on mount (Android back button support)
  useEffect(() => {
    window.history.replaceState({ page: 'landing' }, '', '/');
  }, []);

  // Listen for popstate; always route back to landing
  useEffect(() => {
    const handlePopState = () => {
      if (voterStep !== 'landing') {
        setVoterStep('landing');
        setCurrentUser(null);
        setRegistrationDraft(null);
        setBackPressCount(0);
      } else {
        if (backPressCount === 0) {
          setBackPressCount(1);
          const toast = document.createElement('div');
          toast.className =
            'fixed bottom-20 left-1/2 -translate-x-1/2 bg-zinc-800 border border-zinc-700 text-zinc-100 px-4 py-2 rounded-xl shadow-xl z-[200] text-sm font-medium whitespace-nowrap';
          toast.textContent = 'Press back again to exit';
          document.body.appendChild(toast);
          setTimeout(() => {
            toast.remove();
            setBackPressCount(0);
          }, 2000);
          window.history.pushState({ page: 'landing' }, '', '/');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [voterStep, backPressCount]);

  useEffect(() => {
    setBackPressCount(0);
  }, [voterStep]);

  // --- Navigation handlers ---
  const handleViewChange = (newView: ViewType) => {
    setView(newView);
    if (newView === 'landing') {
      setVoterStep('landing');
    }
  };

  const handleBackToLanding = () => {
    setVoterStep('landing');
    setCurrentUser(null);
    setRegistrationDraft(null);
  };

  const handleNavigateToRegister = () => {
    window.history.pushState({ page: 'register' }, '', '/');
    setVoterStep('register');
  };

  const handleNavigateToLogin = () => {
    window.history.pushState({ page: 'login' }, '', '/');
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

  const BackButton = () => (
    <div className="w-full max-w-sm mx-auto mb-4">
      <button
        type="button"
        onClick={handleBackToLanding}
        className="flex items-center gap-1 text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors min-h-[44px] px-1"
        aria-label="Back to Home"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Back to Home</span>
      </button>
    </div>
  );

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
            <BackButton />
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
            <BackButton />
            <div className="flex items-center justify-center min-h-[calc(100svh-12rem)]">
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

  // Admin view — full-screen, separate from voter layout
  if (view === 'admin') {
    return (
      <NotificationProvider>
        <div className="min-h-screen bg-zinc-950 font-sans relative selection:bg-violet-500/30">
          <AdminDashboard onBack={() => handleViewChange('landing')} />
        </div>
      </NotificationProvider>
    );
  }

  // Voter view — in this render path view is always 'landing', so dock Voter tab is always active
  return (
    <NotificationProvider>
      <div className="min-h-screen dot-bg font-sans text-zinc-100 relative selection:bg-violet-500/30">

        <Navigation view={view} onViewChange={handleViewChange} isVisible={true} />

        <main className="relative z-10 min-h-screen pt-12 sm:pt-14 pb-20 md:pb-10 px-4 transition-colors duration-500">
          <div className="max-w-5xl mx-auto">
            {renderVoterFlow()}
          </div>
        </main>

        {/* Mobile Bottom Dock */}
        <div className="fixed bottom-0 left-0 right-0 z-50 block md:hidden">
          <div className="bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-700/50 flex">
            {/* Voter — always active in this render path */}
            <button
              type="button"
              onClick={() => handleViewChange('landing')}
              className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-[10px] font-semibold transition-colors text-violet-400"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Voter</span>
              <div className="w-1 h-1 rounded-full bg-violet-400 mt-0.5" />
            </button>
            {/* Admin — never active in this render path (admin view has early return above) */}
            <button
              type="button"
              onClick={() => handleViewChange('admin')}
              className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-[10px] font-semibold transition-colors text-zinc-500 hover:text-zinc-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Admin</span>
            </button>
          </div>
        </div>

        <PWADebugUtility />
      </div>
    </NotificationProvider>
  );
}

export default App;
