import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { User } from '../../shared/types';

interface RegistrationSuccessPageProps {
  user: User;
  onDone: () => void;
}

export const RegistrationSuccessPage: React.FC<RegistrationSuccessPageProps> = ({ user, onDone }) => {
  const isVerified = user.verificationStatus === 'verified';
  const isPending = user.verificationStatus === 'pending_manual_review';
  const isRejected = user.verificationStatus === 'rejected';

  return (
    <div className="w-full max-w-md mx-auto px-3 relative">
      <div className="glass-panel relative rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 border-white/50 w-full">
        <div className="text-center">
          {isVerified && (
            <>
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3 tracking-tight">
                Registration Successful!
              </h2>
              <p className="text-slate-600 mb-4">
                Your identity has been verified successfully.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-green-800 font-medium">
                  <CheckCircle className="h-4 w-4 inline mr-1" /> You are eligible to vote
                </p>
                <p className="text-xs text-green-600 mt-2">
                  Matric Number: <span className="font-mono font-bold">{user.matricNumber}</span>
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Confidence Score: {user.ocrConfidenceScore}%
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-800 font-semibold flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 mr-1" /> What's Next?
                </p>
                <p className="text-xs text-blue-600 mt-2">
                  Come back when the election starts to cast your vote using your matric number.
                </p>
              </div>
            </>
          )}

          {isPending && (
            <>
              <Clock className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-yellow-700 mb-2">
                Pending Review
              </h2>
              <p className="text-slate-600 mb-4">
                Your registration is under manual review.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-yellow-800 font-medium flex items-center justify-center">
                  <Clock className="h-4 w-4 mr-1" /> Verification pending
                </p>
                <p className="text-xs text-yellow-600 mt-2">
                  Matric Number: <span className="font-mono font-bold">{user.matricNumber}</span>
                </p>
                {user.rejectionReason && (
                  <p className="text-xs text-yellow-600 mt-2">
                    Reason: {user.rejectionReason}
                  </p>
                )}
              </div>
              <p className="text-sm text-slate-500 mb-6">
                An admin will review your documents shortly. Check back later.
              </p>
            </>
          )}

          {isRejected && (
            <>
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-red-700 mb-2">
                Verification Failed
              </h2>
              <p className="text-slate-600 mb-4">
                Your registration could not be verified.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-red-800 font-medium flex items-center justify-center">
                  <XCircle className="h-4 w-4 mr-1" /> Not eligible to vote
                </p>
                {user.rejectionReason && (
                  <p className="text-xs text-red-600 mt-2">
                    Reason: {user.rejectionReason}
                  </p>
                )}
              </div>
              <p className="text-sm text-slate-500 mb-6">
                Please contact an administrator for assistance.
              </p>
            </>
          )}

          <button
            onClick={onDone}
            className="w-full py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
