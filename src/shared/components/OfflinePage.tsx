import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

export const OfflinePage: React.FC = () => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-zinc-950 dot-bg flex items-center justify-center p-4">
      <div className="w-[92%] max-w-sm mx-auto">
        <div className="bento-card p-6 sm:p-8 text-center">
          <div className="mb-5">
            <div className="h-14 w-14 bg-zinc-800 border border-zinc-700/50 rounded-2xl flex items-center justify-center mx-auto">
              <WifiOff className="h-7 w-7 text-zinc-500" />
            </div>
          </div>

          <h1 className="text-xl font-extrabold text-zinc-100 mb-2">
            You're Offline
          </h1>
          <p className="text-zinc-400 text-sm mb-6">
            It looks like you've lost your internet connection. Please check your network and try again.
          </p>

          <button
            type="button"
            onClick={handleRetry}
            className="w-full flex items-center justify-center gap-2 py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-all text-sm min-h-[44px]"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>

          <div className="mt-5 pt-4 border-t border-zinc-700/50">
            <p className="text-xs text-zinc-500">
              Voting requires an active internet connection to ensure your vote is securely recorded.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
