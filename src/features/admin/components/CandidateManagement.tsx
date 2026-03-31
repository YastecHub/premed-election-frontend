import React, { useState } from 'react';
import { Candidate, Category } from '../../../shared/types';
import { adminService } from '../../../core/services/admin.service';
import { useNotification } from '../../../shared/contexts/NotificationContext';
import { useConfirmation } from '../../../shared/hooks/useConfirmation';
import { ConfirmationModal } from '../../../shared/components/ConfirmationModal';
import { Plus, Trash2 } from 'lucide-react';

interface CandidateManagementProps {
  candidates: Candidate[];
  categories: Category[];
  onUpdate: () => void;
}

export const CandidateManagement: React.FC<CandidateManagementProps> = ({ candidates, categories, onUpdate }) => {
  const { showError, showSuccess } = useNotification();
  const { confirm, isOpen, options, handleConfirm, handleCancel } = useConfirmation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    categoryId: '',
    department: '',
    photoUrl: '',
    manifesto: '',
    color: 'bg-blue-500'
  });

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidate.categoryId) {
      showError('Please select a category');
      return;
    }
    try {
      await adminService.addCandidate(newCandidate);
      showSuccess('Candidate added successfully');
      setShowAddForm(false);
      setNewCandidate({ name: '', categoryId: '', department: '', photoUrl: '', manifesto: '', color: 'bg-blue-500' });
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
          <Plus className="h-4 w-4" />
          <span>Add Candidate</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddCandidate} className="bg-slate-800 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold">Add New Candidate</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="candidate-name" className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
              <input
                id="candidate-name"
                type="text"
                placeholder="Full Name"
                value={newCandidate.name}
                onChange={(e) => setNewCandidate(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-700 rounded-lg text-white"
                required
              />
            </div>
            
            <div>
              <label htmlFor="candidate-category" className="block text-sm font-medium text-slate-300 mb-1">Category</label>
              <select
                id="candidate-category"
                value={newCandidate.categoryId}
                onChange={(e) => setNewCandidate(prev => ({ ...prev, categoryId: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-700 rounded-lg text-white"
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="candidate-department" className="block text-sm font-medium text-slate-300 mb-1">Department</label>
              <input
                id="candidate-department"
                type="text"
                placeholder="Department"
                value={newCandidate.department}
                onChange={(e) => setNewCandidate(prev => ({ ...prev, department: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-700 rounded-lg text-white"
                required
              />
            </div>
            
            <div>
              <label htmlFor="candidate-photo" className="block text-sm font-medium text-slate-300 mb-1">Photo URL</label>
              <input
                id="candidate-photo"
                type="url"
                placeholder="Photo URL"
                value={newCandidate.photoUrl}
                onChange={(e) => setNewCandidate(prev => ({ ...prev, photoUrl: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-700 rounded-lg text-white"
                required
              />
            </div>
            
            <div>
              <label htmlFor="candidate-color" className="block text-sm font-medium text-slate-300 mb-1">Color Theme</label>
              <select
                id="candidate-color"
                value={newCandidate.color}
                onChange={(e) => setNewCandidate(prev => ({ ...prev, color: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-700 rounded-lg text-white"
              >
                <option value="bg-blue-500">Blue</option>
                <option value="bg-green-500">Green</option>
                <option value="bg-purple-500">Purple</option>
                <option value="bg-red-500">Red</option>
                <option value="bg-yellow-500">Yellow</option>
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="candidate-manifesto" className="block text-sm font-medium text-slate-300 mb-1">Manifesto</label>
            <textarea
              id="candidate-manifesto"
              placeholder="Manifesto"
              value={newCandidate.manifesto}
              onChange={(e) => setNewCandidate(prev => ({ ...prev, manifesto: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-700 rounded-lg text-white h-24"
              required
            />
          </div>
          
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

      {/* Group candidates by category */}
      {categories.map(category => {
        const categoryCandidates = candidates.filter(c => c.categoryId === category._id);
        if (categoryCandidates.length === 0) return null;
        
        return (
          <div key={category._id} className="space-y-4">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-white">{category.name}</h3>
              <span className="text-sm text-slate-400">({categoryCandidates.length})</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryCandidates.map(candidate => (
                <div key={candidate._id} className="bg-slate-800 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{candidate.name}</h3>
                    <button
                      onClick={() => handleDeleteCandidate(candidate._id, candidate.name)}
                      className="p-1 text-red-400 hover:text-red-300 transition-colors"
                      title="Delete candidate"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm text-slate-400 mb-1">{candidate.department}</p>
                  <p className="text-xs text-slate-500 mb-2 line-clamp-2">{candidate.manifesto}</p>
                  <p className="text-sm font-medium text-blue-400">Votes: {candidate.voteCount}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      
      {/* Show message if no candidates */}
      {candidates.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          <p>No candidates added yet</p>
        </div>
      )}
      
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