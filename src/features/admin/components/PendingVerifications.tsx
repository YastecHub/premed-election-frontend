import React from 'react';
import { User } from '../../../shared/types';
import { adminService } from '../../../core/services/admin.service';
import { useNotification } from '../../../shared/contexts/NotificationContext';
import { Check, X, ClipboardList } from 'lucide-react';

interface PendingVerificationsProps {
  users: User[];
  onUpdate: () => void;
}

export const PendingVerifications: React.FC<PendingVerificationsProps> = ({ users, onUpdate }) => {
  const { showError, showSuccess } = useNotification();

  const handleApprove = async (userId: string) => {
    try {
      await adminService.approveUser(userId);
      showSuccess('User approved successfully');
      onUpdate();
    } catch (error: any) {
      showError(error.message || 'Failed to approve user');
    }
  };

  const handleReject = async (userId: string) => {
    try {
      await adminService.rejectUser(userId);
      showSuccess('User rejected');
      onUpdate();
    } catch (error: any) {
      showError(error.message || 'Failed to reject user');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-bold text-zinc-100">
        Pending Verifications
        <span className="ml-2 text-sm font-medium text-zinc-500">({users.length})</span>
      </h2>

      {users.length === 0 ? (
        <div className="bento-card p-10 text-center">
          <ClipboardList className="h-10 w-10 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm">No pending verifications</p>
        </div>
      ) : (
        users.map(user => (
          <div key={user._id} className="bento-card p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-zinc-100 truncate">{user.fullName}</h3>
                <p className="text-sm text-zinc-400 truncate mt-0.5">
                  {user.matricNumber} &bull; {user.department}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  OCR Confidence: <span className="text-violet-400 font-medium">{(user.ocrConfidenceScore * 100).toFixed(1)}%</span>
                </p>
              </div>
              <div className="flex space-x-2 flex-shrink-0">
                <button
                  onClick={() => handleApprove(user._id)}
                  className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all min-h-[44px] flex items-center justify-center gap-1.5 text-sm font-medium"
                  title="Approve"
                  aria-label="Approve user"
                >
                  <Check className="h-4 w-4" />
                  <span className="sm:hidden">Approve</span>
                </button>
                <button
                  onClick={() => handleReject(user._id)}
                  className="flex-1 sm:flex-none px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl transition-all min-h-[44px] flex items-center justify-center gap-1.5 text-sm font-medium"
                  title="Reject"
                  aria-label="Reject user"
                >
                  <X className="h-4 w-4" />
                  <span className="sm:hidden">Reject</span>
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
