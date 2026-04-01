import React, { useState, useEffect } from 'react';
import { Category, CategoryForm } from '../../../shared/types';
import { categoryService } from '../../../core/services/category.service';
import { useNotification } from '../../../shared/contexts/NotificationContext';
import { useConfirmation } from '../../../shared/hooks/useConfirmation';
import { ConfirmationModal } from '../../../shared/components/ConfirmationModal';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';

const inputClass =
  'block w-full rounded-xl bg-zinc-800 border border-zinc-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 px-4 py-3 text-zinc-100 placeholder-zinc-600 text-sm outline-none transition-all min-h-[44px]';

export const CategoryManagement: React.FC = () => {
  const { showError, showSuccess } = useNotification();
  const { confirm, isOpen, options, handleConfirm, handleCancel } = useConfirmation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CategoryForm>({ name: '', description: '' });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (error: any) {
      showError(error.message || 'Failed to load categories');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await categoryService.updateCategory(editingId, formData);
        showSuccess('Category updated successfully');
      } else {
        await categoryService.createCategory(formData);
        showSuccess('Category created successfully');
      }
      resetForm();
      loadCategories();
    } catch (error: any) {
      showError(error.message || 'Failed to save category');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category._id);
    setFormData({ name: category.name, description: category.description || '' });
    setShowForm(true);
  };

  const handleDelete = async (id: string, name: string) => {
    const confirmed = await confirm({
      title: 'Delete Category',
      message: `Are you sure you want to delete "${name}"? This will affect all candidates in this category.`,
      confirmText: 'Delete',
      type: 'danger'
    });

    if (!confirmed) return;

    try {
      await categoryService.deleteCategory(id);
      showSuccess('Category deleted successfully');
      loadCategories();
    } catch (error: any) {
      showError(error.message || 'Failed to delete category');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg sm:text-xl font-bold text-zinc-100">
          Categories
          <span className="ml-2 text-sm font-medium text-zinc-500">({categories.length})</span>
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-all min-h-[44px] text-sm font-semibold"
          aria-label="Add new category"
        >
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bento-card p-4 sm:p-6 space-y-4">
          <h3 className="text-base font-semibold text-zinc-100">
            {editingId ? 'Edit Category' : 'Add New Category'}
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                Category Name
              </label>
              <input
                type="text"
                placeholder="e.g., President, Secretary"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                Description <span className="text-zinc-600 normal-case font-normal">(optional)</span>
              </label>
              <textarea
                placeholder="Brief description of this position..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="block w-full rounded-xl bg-zinc-800 border border-zinc-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 px-4 py-3 text-zinc-100 placeholder-zinc-600 text-sm outline-none transition-all h-20 resize-none"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all font-semibold text-sm min-h-[44px]"
            >
              {editingId ? 'Update Category' : 'Create Category'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="w-full sm:w-auto px-5 py-3 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 rounded-xl transition-all text-sm font-medium min-h-[44px]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {categories.length === 0 ? (
        <div className="bento-card p-10 text-center">
          <Tag className="h-10 w-10 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm">No categories yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(category => (
            <div key={category._id} className="bento-card p-4">
              <div className="flex justify-between items-start mb-1.5">
                <h3 className="font-semibold text-zinc-100">{category.name}</h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-1.5 text-zinc-600 hover:text-violet-400 transition-colors rounded-lg hover:bg-violet-400/10"
                    title="Edit category"
                    aria-label={`Edit ${category.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category._id, category.name)}
                    className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10"
                    title="Delete category"
                    aria-label={`Delete ${category.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {category.description && (
                <p className="text-sm text-zinc-500">{category.description}</p>
              )}
            </div>
          ))}
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
