import React, { useState } from 'react';
import { Candidate, Category } from '../../../shared/types';
import { adminService } from '../../../core/services/admin.service';
import { useNotification } from '../../../shared/contexts/NotificationContext';
import { useConfirmation } from '../../../shared/hooks/useConfirmation';
import { ConfirmationModal } from '../../../shared/components/ConfirmationModal';
import { FileUpload } from '../../../shared/components/FileUpload';
import { uploadToCloudinary } from '../../../shared/utils/cloudinary';
import { Plus, Trash2, Upload, Users } from 'lucide-react';

interface CandidateManagementProps {
  candidates: Candidate[];
  categories: Category[];
  onUpdate: () => void;
}

const inputClass =
  'block w-full rounded-xl bg-zinc-800 border border-zinc-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 px-4 py-3 text-zinc-100 placeholder-zinc-600 text-sm outline-none transition-all min-h-[44px]';

const labelClass = 'block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5';

export const CandidateManagement: React.FC<CandidateManagementProps> = ({ candidates, categories, onUpdate }) => {
  const { showError, showSuccess } = useNotification();
  const { confirm, isOpen, options, handleConfirm, handleCancel } = useConfirmation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    categoryId: '',
    department: '',
    photoUrl: '',
    manifesto: '',
    color: 'bg-violet-500'
  });

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidate.categoryId) {
      showError('Please select a category');
      return;
    }
    if (!selectedPhoto) {
      showError('Please upload a candidate photo');
      return;
    }

    setIsUploading(true);
    try {
      const photoUrl = await uploadToCloudinary(selectedPhoto);
      await adminService.addCandidate({ ...newCandidate, photoUrl });
      showSuccess('Candidate added successfully');
      setShowAddForm(false);
      setNewCandidate({ name: '', categoryId: '', department: '', photoUrl: '', manifesto: '', color: 'bg-violet-500' });
      setSelectedPhoto(null);
      onUpdate();
    } catch (error: any) {
      showError(error.message || 'Failed to add candidate');
    } finally {
      setIsUploading(false);
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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-lg sm:text-xl font-bold text-zinc-100">
          Candidates
          <span className="ml-2 text-sm font-medium text-zinc-500">({candidates.length})</span>
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-all min-h-[44px] text-sm font-semibold"
          aria-label="Add new candidate"
        >
          <Plus className="h-4 w-4" />
          <span>Add Candidate</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddCandidate} className="bento-card p-4 sm:p-6 space-y-4">
          <h3 className="text-base font-semibold text-zinc-100">Add New Candidate</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="candidate-name" className={labelClass}>Full Name</label>
              <input
                id="candidate-name"
                type="text"
                placeholder="Full Name"
                value={newCandidate.name}
                onChange={(e) => setNewCandidate(prev => ({ ...prev, name: e.target.value }))}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label htmlFor="candidate-category" className={labelClass}>Category</label>
              <select
                id="candidate-category"
                value={newCandidate.categoryId}
                onChange={(e) => setNewCandidate(prev => ({ ...prev, categoryId: e.target.value }))}
                className={`${inputClass} appearance-none cursor-pointer`}
                required
              >
                <option value="" className="bg-zinc-900">Select a category</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id} className="bg-zinc-900">
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="candidate-department" className={labelClass}>Department</label>
              <input
                id="candidate-department"
                type="text"
                placeholder="Department"
                value={newCandidate.department}
                onChange={(e) => setNewCandidate(prev => ({ ...prev, department: e.target.value }))}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label htmlFor="candidate-color" className={labelClass}>Color Theme</label>
              <select
                id="candidate-color"
                value={newCandidate.color}
                onChange={(e) => setNewCandidate(prev => ({ ...prev, color: e.target.value }))}
                className={`${inputClass} appearance-none cursor-pointer`}
              >
                <option value="bg-violet-500" className="bg-zinc-900">Violet</option>
                <option value="bg-cyan-500" className="bg-zinc-900">Cyan</option>
                <option value="bg-emerald-500" className="bg-zinc-900">Emerald</option>
                <option value="bg-red-500" className="bg-zinc-900">Red</option>
                <option value="bg-yellow-500" className="bg-zinc-900">Yellow</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>
              <Upload className="h-3.5 w-3.5 inline mr-1" />
              Candidate Photo
            </label>
            <div className="bg-zinc-800/60 rounded-xl p-4 border border-zinc-700/50">
              <FileUpload
                onFileSelect={setSelectedPhoto}
                acceptedTypes={['image/jpeg', 'image/png', 'image/jpg']}
                maxSize={5 * 1024 * 1024}
                preview={true}
              />
            </div>
          </div>

          <div>
            <label htmlFor="candidate-manifesto" className={labelClass}>Manifesto</label>
            <textarea
              id="candidate-manifesto"
              placeholder="Candidate manifesto..."
              value={newCandidate.manifesto}
              onChange={(e) => setNewCandidate(prev => ({ ...prev, manifesto: e.target.value }))}
              className="block w-full rounded-xl bg-zinc-800 border border-zinc-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 px-4 py-3 text-zinc-100 placeholder-zinc-600 text-sm outline-none transition-all h-24 resize-none"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              type="submit"
              disabled={isUploading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700/50 disabled:cursor-not-allowed text-white rounded-xl transition-all font-semibold text-sm min-h-[44px]"
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Uploading…
                </>
              ) : 'Add Candidate'}
            </button>
            <button
              type="button"
              onClick={() => { setShowAddForm(false); setSelectedPhoto(null); }}
              disabled={isUploading}
              className="w-full sm:w-auto px-5 py-3 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 text-zinc-200 rounded-xl transition-all text-sm font-medium min-h-[44px]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {categories.map(category => {
        const categoryCandidates = candidates.filter(c => {
          const catId = typeof c.categoryId === 'object' ? (c.categoryId as any)._id : c.categoryId;
          return catId === category._id;
        });
        if (categoryCandidates.length === 0) return null;

        return (
          <div key={category._id} className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-zinc-200">{category.name}</h3>
              <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full border border-zinc-700/50">
                {categoryCandidates.length}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryCandidates.map(candidate => (
                <div key={candidate._id} className="bento-card p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-zinc-100 leading-tight">{candidate.name}</h3>
                    <button
                      onClick={() => handleDeleteCandidate(candidate._id, candidate.name)}
                      className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10"
                      title="Delete candidate"
                      aria-label={`Delete ${candidate.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm text-zinc-400 mb-1">{candidate.department}</p>
                  <p className="text-xs text-zinc-500 mb-3 line-clamp-2">{candidate.manifesto}</p>
                  <p className="text-sm font-semibold text-violet-400">
                    {candidate.voteCount} vote{candidate.voteCount !== 1 ? 's' : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {candidates.length === 0 && (
        <div className="bento-card p-10 text-center">
          <Users className="h-10 w-10 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm">No candidates added yet</p>
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
