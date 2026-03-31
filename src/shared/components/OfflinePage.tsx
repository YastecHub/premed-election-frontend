import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

export const OfflinePage: React.FC = () => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-slate-100 p-4 rounded-full">
              <WifiOff className="h-16 w-16 text-slate-400" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-slate-800 mb-3">
            You're Offline
          </h1>

          <p className="text-slate-600 mb-6">
            It looks like you've lost your internet connection. Please check your network and try again.
          </p>

          <button
            onClick={handleRetry}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Try Again</span>
          </button>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              <strong>Note:</strong> Voting requires an active internet connection to ensure your vote is securely recorded.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
