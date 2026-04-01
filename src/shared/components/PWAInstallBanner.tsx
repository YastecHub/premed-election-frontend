import React, { useState, useEffect } from 'react';
import { Smartphone, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if app is already installed using multiple methods
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;
    const wasInstalled = localStorage.getItem('pwa-installed') === 'true';
    
    if (isStandalone || isIOSStandalone || wasInstalled) {
      // Mark as installed and never show banner again
      localStorage.setItem('pwa-installed', 'true');
      return;
    }

    // Check if banner was dismissed recently
    const dismissedTime = localStorage.getItem('pwa-banner-dismissed');
    if (dismissedTime) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        return; // Don't show again for 7 days
      }
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show banner after 3 seconds
      setTimeout(() => {
        setShowBanner(true);
      }, 3000);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      localStorage.setItem('pwa-installed', 'true');
      setShowBanner(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      localStorage.setItem('pwa-installed', 'true');
    }

    setDeferredPrompt(null);
    setShowBanner(false);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa-banner-dismissed', Date.now().toString());
  };

  if (!showBanner || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-2xl p-4 border border-blue-400/30">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4 text-white" />
        </button>

        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 bg-white/20 p-2 rounded-xl">
            <Smartphone className="h-6 w-6 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-sm mb-1">
              📲 Install Pre-MedElect
            </h3>
            <p className="text-blue-100 text-xs mb-3">
              Install on your phone for instant election alerts!
            </p>
            
            <button
              onClick={handleInstallClick}
              className="w-full bg-white text-blue-700 font-bold py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors text-sm"
            >
              Install App
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
