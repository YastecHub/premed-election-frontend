import React, { useEffect, useState } from 'react';
import { User } from '../../../shared/types';
import { socket } from '../../../core/services/socket.service';
import { SOCKET_EVENTS } from '../../../shared/constants';
import { CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';
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
      case 'pending':
        return (
          <div className="flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-4 py-3 rounded-lg">
            <ClockIcon className="h-5 w-5" />
            <span className="font-semibold">Document under review</span>
          </div>
        );
      case 'verified':
        return (
          <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-3 rounded-lg">
            <CheckCircleIcon className="h-5 w-5" />
            <span className="font-semibold">Verified ✓ - You can vote</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="bg-red-100 text-red-800 px-4 py-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <XCircleIcon className="h-5 w-5" />
              <span className="font-semibold">Verification failed</span>
            </div>
            {currentUser.rejectionReason && (
              <p className="text-sm mt-2">{currentUser.rejectionReason}</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 md:p-8 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Registration Status</h2>
        <p className="text-slate-600">Welcome, {currentUser.fullName}</p>
      </div>

      <div className="space-y-4">
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500 font-medium">Matric Number</p>
              <p className="text-slate-800 font-semibold">{currentUser.matricNumber}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Department</p>
              <p className="text-slate-800 font-semibold">{currentUser.department}</p>
            </div>
            <div className="col-span-2">
              <p className="text-slate-500 font-medium">Email</p>
              <p className="text-slate-800 font-semibold">{currentUser.email}</p>
            </div>
          </div>
        </div>

        {getStatusBadge()}

        {currentUser.verificationStatus === 'pending' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>What's happening?</strong><br />
              Our system is verifying your student ID card using OCR technology. 
              An admin will review your submission shortly. You'll be notified once verification is complete.
            </p>
            {currentUser.ocrConfidenceScore > 0 && (
              <p className="text-xs text-blue-600 mt-2">
                OCR Confidence: {(currentUser.ocrConfidenceScore * 100).toFixed(0)}%
              </p>
            )}
          </div>
        )}

        {currentUser.verificationStatus === 'rejected' && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <p className="text-sm text-slate-700">
              <strong>Next steps:</strong><br />
              Please contact the election administrator to resolve this issue or re-register with a clearer photo of your student ID.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
