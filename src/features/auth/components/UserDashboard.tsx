import React, { useEffect, useState } from 'react';
import { User } from '../../../shared/types';
import { socket } from '../../../core/services/socket.service';
import { SOCKET_EVENTS } from '../../../shared/constants';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { useNotification } from '../../../shared/contexts/NotificationContext';

interface UserDashboardProps {
  user: User;
  onStatusChange?: (user: User) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ user, onStatusChange }) => {
  const [currentUser, setCurrentUser] = useState(user);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    const handleStatusUpdate = (data: any) => {
      if (data.matricNumber === currentUser.matricNumber) {
        const updatedUser = { ...currentUser, ...data };
        setCurrentUser(updatedUser);
        onStatusChange?.(updatedUser);

        if (data.verificationStatus === 'verified') {
          showSuccess('Your document has been verified! You can now vote.');
        } else if (data.verificationStatus === 'rejected') {
          showError(`Verification rejected: ${data.rejectionReason || 'Please contact admin'}`);
        }
      }
    };

    socket.on(SOCKET_EVENTS.USER_STATUS_UPDATE, handleStatusUpdate);
    return () => socket.off(SOCKET_EVENTS.USER_STATUS_UPDATE, handleStatusUpdate);
  }, [currentUser.matricNumber]);

  const getStatusBadge = () => {
    switch (currentUser.verificationStatus) {
      case 'pending_manual_review':
        return (
          <div className="flex items-center gap-2 bg-amber-500/10 text-amber-300 px-4 py-3 rounded-xl border border-amber-500/20">
            <Clock className="h-5 w-5 flex-shrink-0" />
            <span className="font-semibold text-sm">Document under review</span>
          </div>
        );
      case 'verified':
        return (
          <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-300 px-4 py-3 rounded-xl border border-emerald-500/20">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <span className="font-semibold text-sm">Verified — You can vote</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="bg-red-500/10 text-red-300 px-4 py-3 rounded-xl border border-red-500/20">
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="h-5 w-5 flex-shrink-0" />
              <span className="font-semibold text-sm">Verification failed</span>
            </div>
            {currentUser.rejectionReason && (
              <p className="text-xs text-red-400/70 mt-1">{currentUser.rejectionReason}</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bento-card p-5 sm:p-7 max-w-md mx-auto">
      <div className="text-center mb-5">
        <h2 className="text-xl font-extrabold text-zinc-100 mb-1">Registration Status</h2>
        <p className="text-zinc-400 text-sm">Welcome, {currentUser.fullName}</p>
      </div>

      <div className="space-y-3">
        <div className="bg-zinc-800/60 rounded-xl p-4 border border-zinc-700/50">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Matric Number</p>
              <p className="text-zinc-200 font-semibold">{currentUser.matricNumber}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Department</p>
              <p className="text-zinc-200 font-semibold">{currentUser.department}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Email</p>
              <p className="text-zinc-200 font-semibold">{currentUser.email}</p>
            </div>
          </div>
        </div>

        {getStatusBadge()}

        {currentUser.verificationStatus === 'pending_manual_review' && (
          <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
            <p className="text-xs text-violet-300">
              <strong>What's happening?</strong><br />
              Our system is verifying your student ID card using OCR technology.
              An admin will review your submission shortly.
            </p>
            {currentUser.ocrConfidenceScore > 0 && (
              <p className="text-[10px] text-violet-400/70 mt-2">
                OCR Confidence: {(currentUser.ocrConfidenceScore * 100).toFixed(0)}%
              </p>
            )}
          </div>
        )}

        {currentUser.verificationStatus === 'rejected' && (
          <div className="bg-zinc-800/60 border border-zinc-700/50 rounded-xl p-4">
            <p className="text-xs text-zinc-400">
              <strong className="text-zinc-300">Next steps:</strong><br />
              Please contact the election administrator to resolve this issue or re-register with a clearer photo of your student ID.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
