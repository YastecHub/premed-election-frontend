import React, { useState, useEffect } from 'react';
import { Category, CategoryForm } from '../../../shared/types';
import { categoryService } from '../../../core/services/category.service';
import { useNotification } from '../../../shared/contexts/NotificationContext';
import { useConfirmation } from '../../../shared/hooks/useConfirmation';
import { ConfirmationModal } from '../../../shared/components/ConfirmationModal';
import { Plus, Pencil, Trash2 } from 'lucide-react';

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-white">Categories ({categories.length})</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors min-h-[44px]"
        >
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-lg p-4 md:p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">
            {editingId ? 'Edit Category' : 'Add New Category'}
          </h3>
          
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Category Name (e.g., President, Secretary)"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-3 bg-slate-700 rounded-lg text-white min-h-[44px]"
              required
            />
            
            <textarea
              placeholder="Description (optional)"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-3 bg-slate-700 rounded-lg text-white h-20 resize-none"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors min-h-[44px]"
            >
              {editingId ? 'Update Category' : 'Create Category'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="w-full sm:w-auto px-4 py-3 bg-slate-600 hover:bg-slate-700 rounded-lg transition-colors min-h-[44px]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(category => (
          <div key={category._id} className="bg-slate-800 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-white">{category.name}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                  title="Edit category"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(category._id, category.name)}
                  className="p-1 text-red-400 hover:text-red-300 transition-colors"
                  title="Delete category"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            {category.description && (
              <p className="text-sm text-slate-400">{category.description}</p>
            )}
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