import React, { useState } from 'react';
import { Candidate } from '../../../shared/types';
import { adminService } from '../../../core/services/admin.service';
import { useNotification } from '../../../shared/contexts/NotificationContext';
import { useConfirmation } from '../../../shared/hooks/useConfirmation';
import { ConfirmationModal } from '../../../shared/components/ConfirmationModal';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface CandidateManagementProps {
  candidates: Candidate[];
  onUpdate: () => void;
}

export const CandidateManagement: React.FC<CandidateManagementProps> = ({ candidates, onUpdate }) => {
  const { showError, showSuccess } = useNotification();
  const { confirm, isOpen, options, handleConfirm, handleCancel } = useConfirmation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    position: 'Governor',
    photoUrl: '',
    manifesto: '',
    color: 'bg-blue-500'
  });

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminService.addCandidate(newCandidate);
      showSuccess('Candidate added successfully');
      setShowAddForm(false);
      setNewCandidate({ name: '', position: 'Governor', photoUrl: '', manifesto: '', color: 'bg-blue-500' });
      onUpdate();
    } catch (error: any) {
      showError(error.message || 'Failed to add candidate');
    }
  };

  const handleDeleteCandidate = async (id: string, name: string) => {
    const confirmed = await confirm({
      title: 'Delete Candidate',
      message: `Are you sure you want to delete ${name}? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    });
    
    if (!confirmed) return;
    
    try {
      await adminService.deleteCandidate(id);
      showSuccess('Candidate deleted successfully');
      onUpdate();
    } catch (error: any) {
      showError(error.message || 'Failed to delete candidate');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Candidates ({candidates.length})</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Add Candidate</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddCandidate} className="bg-slate-800 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold">Add New Candidate</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={newCandidate.name}
              onChange={(e) => setNewCandidate(prev => ({ ...prev, name: e.target.value }))}
              className="px-3 py-2 bg-slate-700 rounded-lg text-white"
              required
            />
            
            <select
              value={newCandidate.position}
              onChange={(e) => setNewCandidate(prev => ({ ...prev, position: e.target.value }))}
              className="px-3 py-2 bg-slate-700 rounded-lg text-white"
            >
              <option value="Governor">Governor</option>
              <option value="Vice Governor">Vice Governor</option>
              <option value="Secretary">Secretary</option>
            </select>
            
            <input
              type="url"
              placeholder="Photo URL"
              value={newCandidate.photoUrl}
              onChange={(e) => setNewCandidate(prev => ({ ...prev, photoUrl: e.target.value }))}
              className="px-3 py-2 bg-slate-700 rounded-lg text-white"
              required
            />
            
            <select
              value={newCandidate.color}
              onChange={(e) => setNewCandidate(prev => ({ ...prev, color: e.target.value }))}
              className="px-3 py-2 bg-slate-700 rounded-lg text-white"
            >
              <option value="bg-blue-500">Blue</option>
              <option value="bg-green-500">Green</option>
              <option value="bg-purple-500">Purple</option>
              <option value="bg-red-500">Red</option>
              <option value="bg-yellow-500">Yellow</option>
            </select>
          </div>
          
          <textarea
            placeholder="Manifesto"
            value={newCandidate.manifesto}
            onChange={(e) => setNewCandidate(prev => ({ ...prev, manifesto: e.target.value }))}
            className="w-full px-3 py-2 bg-slate-700 rounded-lg text-white h-24"
            required
          />
          
          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              Add Candidate
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {candidates.map(candidate => (
          <div key={candidate._id} className="bg-slate-800 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{candidate.name}</h3>
              <button
                onClick={() => handleDeleteCandidate(candidate._id, candidate.name)}
                className="p-1 text-red-400 hover:text-red-300 transition-colors"
                title="Delete candidate"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-slate-400 mb-2">{candidate.position}</p>
            <p className="text-xs text-slate-500 mb-2">{candidate.manifesto}</p>
            <p className="text-sm font-medium text-blue-400">Votes: {candidate.voteCount}</p>
          </div>
        ))}
      </div>
      
      <ConfirmationModal
        isOpen={isOpen}
        title={options.title}
        message={options.message}
        confirmText={options.confirmText}
        cancelText={options.cancelText}
        type={options.type}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};