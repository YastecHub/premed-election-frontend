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
      <h2 className="text-xl font-bold mb-4">Pending Verifications ({users.length})</h2>
      
      {users.length === 0 ? (
        <div className="text-center text-slate-400 py-8">
          No pending verifications
        </div>
      ) : (
        users.map(user => (
          <div key={user._id} className="bg-slate-800 rounded-lg p-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{user.fullName}</h3>
              <p className="text-sm text-slate-400">{user.matricNumber} • {user.department}</p>
              <p className="text-xs text-slate-500">Confidence: {(user.ocrConfidenceScore * 100).toFixed(1)}%</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleApprove(user._id)}
                className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                title="Approve"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleReject(user._id)}
                className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                title="Reject"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};