import React, { useState, useEffect } from 'react';
import { Smartphone, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Mark the app as installed in localStorage so the banner is suppressed permanently
function markInstalled() {
  localStorage.setItem('pwa-installed', 'true');
}

// True when running as an installed PWA (launched from home screen / app icon)
function isRunningInstalled(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    window.matchMedia('(display-mode: minimal-ui)').matches ||
    (window.navigator as any).standalone === true ||
    localStorage.getItem('pwa-installed') === 'true'
  );
}

export const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Already installed — persist the flag and skip everything
    if (isRunningInstalled()) {
      markInstalled();
      return;
    }

    // Dismissed recently — respect the 7-day cooldown
    const dismissedAt = localStorage.getItem('pwa-banner-dismissed');
    if (dismissedAt) {
      const daysSince = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) return;
    }

    let isMounted = true;

    const handleBeforeInstallPrompt = async (e: Event) => {
      e.preventDefault();

      // Use getInstalledRelatedApps if the browser supports it.
      // Returns a non-empty array when this PWA origin is already installed,
      // even if the user installed via the browser's own Add-to-Home-Screen button.
      if ('getInstalledRelatedApps' in navigator) {
        try {
          const relatedApps = await (navigator as any).getInstalledRelatedApps();
          if (relatedApps.length > 0) {
            markInstalled();
            return; // PWA already on device — don't prompt
          }
        } catch {
          // API unavailable in this context; fall through to normal prompt
        }
      }

      if (!isMounted) return;
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Small delay so the user has a moment to load the page first
      setTimeout(() => {
        if (isMounted) setShowBanner(true);
      }, 3000);
    };

    const handleAppInstalled = () => {
      markInstalled();
      setShowBanner(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      isMounted = false;
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') markInstalled();
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa-banner-dismissed', Date.now().toString());
  };

  if (!showBanner || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-3 right-3 md:left-auto md:right-6 md:max-w-sm z-[100]">
      <div className="bento-card p-4 shadow-2xl shadow-black/50">
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1 text-zinc-500 hover:text-zinc-300 transition-colors rounded-lg hover:bg-zinc-700/50"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3 pr-6">
          <div className="flex-shrink-0 bg-violet-500/15 border border-violet-500/20 p-2.5 rounded-xl">
            <Smartphone className="h-5 w-5 text-violet-400" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-zinc-100 font-bold text-sm mb-0.5">Install Pre-MedElect</h3>
            <p className="text-zinc-500 text-xs mb-3">
              Add to your home screen for quick access.
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleInstallClick}
                className="flex-1 py-2 px-3 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg transition-all"
              >
                Install
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="py-2 px-3 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-xs font-medium rounded-lg transition-all"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
