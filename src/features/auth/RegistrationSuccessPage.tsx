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
    <div className="w-[92%] max-w-sm mx-auto">
      <div className="bento-card p-5 sm:p-7 text-center">
        {isVerified && (
          <>
            <div className="mb-4">
              <div className="h-14 w-14 bg-emerald-500/15 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle className="h-7 w-7 text-emerald-400" />
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-100 mb-2">
              Registration Successful!
            </h2>
            <p className="text-zinc-400 text-sm mb-4">
              Your identity has been verified successfully.
            </p>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-4">
              <p className="text-sm text-emerald-300 font-medium flex items-center justify-center gap-1.5">
                <CheckCircle className="h-4 w-4" /> You are eligible to vote
              </p>
              <p className="text-xs text-emerald-400/70 mt-2">
                Matric Number: <span className="font-mono font-bold text-emerald-300">{user.matricNumber}</span>
              </p>
              <p className="text-xs text-emerald-400/70 mt-1">
                Confidence Score: {user.ocrConfidenceScore}%
              </p>
            </div>
            <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4 mb-6">
              <p className="text-xs text-violet-300 font-semibold">What's Next?</p>
              <p className="text-[10px] text-violet-400/70 mt-1">
                Come back when the election starts to cast your vote using your matric number.
              </p>
            </div>
          </>
        )}

        {isPending && (
          <>
            <div className="mb-4">
              <div className="h-14 w-14 bg-amber-500/15 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto">
                <Clock className="h-7 w-7 text-amber-400" />
              </div>
            </div>
            <h2 className="text-xl font-extrabold text-zinc-100 mb-2">Pending Review</h2>
            <p className="text-zinc-400 text-sm mb-4">
              Your registration is under manual review.
            </p>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-4">
              <p className="text-sm text-amber-300 font-medium flex items-center justify-center gap-1.5">
                <Clock className="h-4 w-4" /> Verification pending
              </p>
              <p className="text-xs text-amber-400/70 mt-2">
                Matric Number: <span className="font-mono font-bold text-amber-300">{user.matricNumber}</span>
              </p>
              {user.rejectionReason && (
                <p className="text-xs text-amber-400/70 mt-1">
                  Reason: {user.rejectionReason}
                </p>
              )}
            </div>
            <p className="text-xs text-zinc-500 mb-6">
              An admin will review your documents shortly. Check back later.
            </p>
          </>
        )}

        {isRejected && (
          <>
            <div className="mb-4">
              <div className="h-14 w-14 bg-red-500/15 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto">
                <XCircle className="h-7 w-7 text-red-400" />
              </div>
            </div>
            <h2 className="text-xl font-extrabold text-zinc-100 mb-2">Verification Failed</h2>
            <p className="text-zinc-400 text-sm mb-4">
              Your registration could not be verified.
            </p>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4">
              <p className="text-sm text-red-300 font-medium flex items-center justify-center gap-1.5">
                <XCircle className="h-4 w-4" /> Not eligible to vote
              </p>
              {user.rejectionReason && (
                <p className="text-xs text-red-400/70 mt-2">
                  Reason: {user.rejectionReason}
                </p>
              )}
            </div>
            <p className="text-xs text-zinc-500 mb-6">
              Please contact an administrator for assistance.
            </p>
          </>
        )}

        <button
          type="button"
          onClick={onDone}
          className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold transition-all min-h-[44px] text-sm"
        >
          Done
        </button>
      </div>
    </div>
  );
};
