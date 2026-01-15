import React, { useState, useEffect } from 'react';
import { Admin } from '../../../shared/types';
import { adminService } from '../../../core/services/admin.service';
import { useNotification } from '../../../shared/contexts/NotificationContext';
import { PlusIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Admin Management ({admins.length})</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Add Admin</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddAdmin} className="bg-slate-800 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold">Create New Admin</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Username"
              value={newAdmin.username}
              onChange={(e) => setNewAdmin(prev => ({ ...prev, username: e.target.value }))}
              className="px-3 py-2 bg-slate-700 rounded-lg text-white"
              required
            />
            
            <input
              type="password"
              placeholder="Password"
              value={newAdmin.password}
              onChange={(e) => setNewAdmin(prev => ({ ...prev, password: e.target.value }))}
              className="px-3 py-2 bg-slate-700 rounded-lg text-white"
              required
            />
          </div>
          
          <select
            value={newAdmin.role}
            onChange={(e) => setNewAdmin(prev => ({ ...prev, role: e.target.value as 'moderator' | 'super_admin' }))}
            className="px-3 py-2 bg-slate-700 rounded-lg text-white"
          >
            <option value="moderator">Moderator</option>
            <option value="super_admin">Super Admin</option>
          </select>
          
          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              Create Admin
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

      <div className="space-y-4">
        {admins.map(admin => (
          <div key={admin._id} className="bg-slate-800 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShieldCheckIcon className={`h-6 w-6 ${admin.role === 'super_admin' ? 'text-red-400' : 'text-blue-400'}`} />
              <div>
                <h3 className="font-semibold">{admin.username}</h3>
                <p className="text-sm text-slate-400 capitalize">{admin.role.replace('_', ' ')}</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              admin.role === 'super_admin' 
                ? 'bg-red-900 text-red-200' 
                : 'bg-blue-900 text-blue-200'
            }`}>
              {admin.role === 'super_admin' ? 'Super Admin' : 'Moderator'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};