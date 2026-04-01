import React, { useState, useEffect } from 'react';
import { Admin } from '../../../shared/types';
import { adminService } from '../../../core/services/admin.service';
import { useNotification } from '../../../shared/contexts/NotificationContext';
import { Plus, ShieldCheck, ShieldAlert } from 'lucide-react';

const inputClass =
  'block w-full rounded-xl bg-zinc-800 border border-zinc-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 px-4 py-3 text-zinc-100 placeholder-zinc-600 text-sm outline-none transition-all min-h-[44px]';

const labelClass = 'block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5';

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
    <div className="space-y-4 sm:space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-lg sm:text-xl font-bold text-zinc-100">
          Admin Management
          <span className="ml-2 text-sm font-medium text-zinc-500">({admins.length})</span>
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          type="button"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-all min-h-[44px] text-sm font-semibold"
          aria-label="Add new admin"
        >
          <Plus className="h-4 w-4" />
          <span>Add Admin</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddAdmin} className="bento-card p-4 sm:p-6 space-y-4">
          <h3 className="text-base font-semibold text-zinc-100">Create New Admin</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="admin-username" className={labelClass}>Username</label>
              <input
                id="admin-username"
                type="text"
                placeholder="Username"
                value={newAdmin.username}
                onChange={(e) => setNewAdmin(prev => ({ ...prev, username: e.target.value }))}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label htmlFor="admin-password" className={labelClass}>Password</label>
              <input
                id="admin-password"
                type="password"
                placeholder="••••••••"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin(prev => ({ ...prev, password: e.target.value }))}
                className={inputClass}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="admin-role" className={labelClass}>Role</label>
            <select
              id="admin-role"
              value={newAdmin.role}
              onChange={(e) => setNewAdmin(prev => ({ ...prev, role: e.target.value as 'moderator' | 'super_admin' }))}
              className={`${inputClass} appearance-none cursor-pointer`}
            >
              <option value="moderator" className="bg-zinc-900">Moderator</option>
              <option value="super_admin" className="bg-zinc-900">Super Admin</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all font-semibold text-sm min-h-[44px]"
            >
              Create Admin
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="w-full sm:w-auto px-5 py-3 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 rounded-xl transition-all text-sm font-medium min-h-[44px]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {admins.map(admin => (
          <div key={admin._id} className="bento-card p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {admin.role === 'super_admin' ? (
                  <ShieldAlert className="h-6 w-6 flex-shrink-0 text-red-400" />
                ) : (
                  <ShieldCheck className="h-6 w-6 flex-shrink-0 text-violet-400" />
                )}
                <div className="min-w-0">
                  <h3 className="font-semibold text-zinc-100 truncate">{admin.username}</h3>
                  <p className="text-sm text-zinc-500 capitalize">{admin.role.replace('_', ' ')}</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 border ${
                admin.role === 'super_admin'
                  ? 'bg-red-500/10 text-red-400 border-red-500/25'
                  : 'bg-violet-500/10 text-violet-400 border-violet-500/25'
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
