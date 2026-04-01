import React, { useState, useEffect } from 'react';
import { Admin } from '../../../shared/types';
import { adminService } from '../../../core/services/admin.service';
import { useNotification } from '../../../shared/contexts/NotificationContext';
import { Plus, ShieldCheck } from 'lucide-react';

export const AdminManagement: React.FC = () => {
  const { showError, showSuccess } = useNotification();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    username: '',
    password: '',
    role: 'moderator' as 'moderator' | 'super_admin'
  });

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      const data = await adminService.getAdmins();
      setAdmins(data);
    } catch (error: any) {
      showError(error.message || 'Failed to load admins');
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminService.createAdmin(newAdmin);
      showSuccess('Admin created successfully');
      setShowAddForm(false);
      setNewAdmin({ username: '', password: '', role: 'moderator' });
      loadAdmins();
    } catch (error: any) {
      showError(error.message || 'Failed to create admin');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-lg sm:text-xl font-bold text-white">Admin Management ({admins.length})</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors min-h-[44px]"
          aria-label="Add new admin"
        >
          <Plus className="h-4 w-4" />
          <span>Add Admin</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddAdmin} className="bg-slate-800 rounded-lg p-4 sm:p-6 space-y-4 border border-slate-700">
          <h3 className="text-base sm:text-lg font-semibold text-white">Create New Admin</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="admin-username" className="block text-sm font-medium text-slate-300 mb-1">Username</label>
              <input
                id="admin-username"
                type="text"
                placeholder="Username"
                value={newAdmin.username}
                onChange={(e) => setNewAdmin(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-700 rounded-lg text-white"
                required
              />
            </div>
            
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-slate-300 mb-1">Password</label>
              <input
                id="admin-password"
                type="password"
                placeholder="Password"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-700 rounded-lg text-white"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="admin-role" className="block text-sm font-medium text-slate-300 mb-1">Role</label>
            <select
              id="admin-role"
              value={newAdmin.role}
              onChange={(e) => setNewAdmin(prev => ({ ...prev, role: e.target.value as 'moderator' | 'super_admin' }))}
              className="w-full px-3 py-2 bg-slate-700 rounded-lg text-white"
            >
              <option value="moderator">Moderator</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors font-medium min-h-[44px]"
            >
              Create Admin
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="w-full sm:w-auto px-4 py-3 bg-slate-600 hover:bg-slate-700 rounded-lg transition-colors font-medium min-h-[44px]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {admins.map(admin => (
          <div key={admin._id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <ShieldCheck className={`h-6 w-6 flex-shrink-0 ${admin.role === 'super_admin' ? 'text-red-400' : 'text-blue-400'}`} />
                <div className="min-w-0">
                  <h3 className="font-semibold text-white truncate">{admin.username}</h3>
                  <p className="text-sm text-slate-400 capitalize">{admin.role.replace('_', ' ')}</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                admin.role === 'super_admin' 
                  ? 'bg-red-900 text-red-200' 
                  : 'bg-blue-900 text-blue-200'
              }`}>
                {admin.role === 'super_admin' ? 'Super Admin' : 'Moderator'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};