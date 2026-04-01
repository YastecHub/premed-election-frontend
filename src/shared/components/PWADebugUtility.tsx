import React, { useState, useEffect } from 'react';

/**
 * PWA Debug Utility Component
 * 
 * This component is hidden by default but can be accessed by adding
 * ?pwa-debug=true to the URL
 * 
 * Usage: https://yoursite.com/?pwa-debug=true
 */
export const PWADebugUtility: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [installState, setInstallState] = useState({
    isStandalone: false,
    isIOSStandalone: false,
    hasInstalledFlag: false,
    hasDismissedFlag: false,
    dismissedTime: null as string | null,
  });

  useEffect(() => {
    // Check if debug mode is enabled via URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const debugMode = urlParams.get('pwa-debug') === 'true';
    setIsVisible(debugMode);

    if (debugMode) {
      checkInstallState();
    }
  }, []);

  const checkInstallState = () => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;
    const hasInstalledFlag = localStorage.getItem('pwa-installed') === 'true';
    const hasDismissedFlag = !!localStorage.getItem('pwa-banner-dismissed');
    const dismissedTime = localStorage.getItem('pwa-banner-dismissed');

    setInstallState({
      isStandalone,
      isIOSStandalone,
      hasInstalledFlag,
      hasDismissedFlag,
      dismissedTime,
    });
  };

  const markAsInstalled = () => {
    localStorage.setItem('pwa-installed', 'true');
    alert('✅ App marked as installed. The install banner will no longer show.');
    checkInstallState();
  };

  const markAsNotInstalled = () => {
    localStorage.removeItem('pwa-installed');
    alert('✅ Install flag removed. The banner may show again if conditions are met.');
    checkInstallState();
  };

  const clearDismissed = () => {
    localStorage.removeItem('pwa-banner-dismissed');
    alert('✅ Dismissed flag cleared.');
    checkInstallState();
  };

  const resetAll = () => {
    localStorage.removeItem('pwa-installed');
    localStorage.removeItem('pwa-banner-dismissed');
    alert('✅ All PWA flags reset. Refresh the page to see changes.');
    checkInstallState();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 text-white p-4 z-[9999] border-t-4 border-yellow-500 shadow-2xl">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-yellow-400">🔧 PWA Debug Utility</h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-800 rounded-lg p-3">
            <h4 className="font-semibold mb-2 text-sm">Install State</h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Standalone Mode:</span>
                <span className={installState.isStandalone ? 'text-green-400' : 'text-red-400'}>
                  {installState.isStandalone ? '✓ Yes' : '✗ No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>iOS Standalone:</span>
                <span className={installState.isIOSStandalone ? 'text-green-400' : 'text-red-400'}>
                  {installState.isIOSStandalone ? '✓ Yes' : '✗ No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Installed Flag:</span>
                <span className={installState.hasInstalledFlag ? 'text-green-400' : 'text-red-400'}>
                  {installState.hasInstalledFlag ? '✓ Yes' : '✗ No'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-3">
            <h4 className="font-semibold mb-2 text-sm">Banner State</h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Dismissed Flag:</span>
                <span className={installState.hasDismissedFlag ? 'text-yellow-400' : 'text-green-400'}>
                  {installState.hasDismissedFlag ? '✓ Yes' : '✗ No'}
                </span>
              </div>
              {installState.dismissedTime && (
                <div className="text-slate-400 mt-2">
                  Dismissed: {new Date(parseInt(installState.dismissedTime)).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            onClick={markAsInstalled}
            className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-xs font-semibold"
          >
            Mark Installed
          </button>
          <button
            onClick={markAsNotInstalled}
            className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-xs font-semibold"
          >
            Remove Installed
          </button>
          <button
            onClick={clearDismissed}
            className="bg-yellow-600 hover:bg-yellow-700 px-3 py-2 rounded text-xs font-semibold"
          >
            Clear Dismissed
          </button>
          <button
            onClick={resetAll}
            className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-xs font-semibold"
          >
            Reset All
          </button>
        </div>

        <div className="mt-3 text-xs text-slate-400">
          <p>💡 To hide this panel, remove <code>?pwa-debug=true</code> from the URL</p>
        </div>
      </div>
    </div>
  );
};
