import React from 'react';
import { User } from '../../../shared/types';
import { adminService } from '../../../core/services/admin.service';
import { useNotification } from '../../../shared/contexts/NotificationContext';
import { Check, X } from 'lucide-react';

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
      <h2 className="text-lg sm:text-xl font-bold mb-4 text-white">Pending Verifications ({users.length})</h2>
      
      {users.length === 0 ? (
        <div className="bg-slate-800 rounded-lg p-8 text-center border border-slate-700">
          <p className="text-slate-400">No pending verifications</p>
        </div>
      ) : (
        users.map(user => (
          <div key={user._id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">{user.fullName}</h3>
                <p className="text-sm text-slate-400 truncate">{user.matricNumber} • {user.department}</p>
                <p className="text-xs text-slate-500">Confidence: {(user.ocrConfidenceScore * 100).toFixed(1)}%</p>
              </div>
              <div className="flex space-x-2 flex-shrink-0">
                <button
                  onClick={() => handleApprove(user._id)}
                  className="flex-1 sm:flex-none px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors min-h-[44px] flex items-center justify-center"
                  title="Approve"
                  aria-label="Approve user"
                >
                  <Check className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleReject(user._id)}
                  className="flex-1 sm:flex-none px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors min-h-[44px] flex items-center justify-center"
                  title="Reject"
                  aria-label="Reject user"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};