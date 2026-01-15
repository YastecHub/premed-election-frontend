import React, { useState, useEffect } from 'react';
import { Admin, AdminLoginForm, User, Candidate, Category } from '../../shared/types';
import { authService } from '../../core/services/auth.service';
import { adminService } from '../../core/services/admin.service';
import { votingService } from '../../core/services/voting.service';
import { categoryService } from '../../core/services/category.service';
import { useNotification } from '../../shared/contexts/NotificationContext';
import { useElection } from '../../shared/hooks/useElection';
import { calculateRankings } from '../../shared/utils/ranking';
import { AdminLogin } from './components/AdminLogin';
import { PendingVerifications } from './components/PendingVerifications';
import { ElectionControls } from './components/ElectionControls';
import { CandidateManagement } from './components/CandidateManagement';
import { CategoryManagement } from './components/CategoryManagement';
import { AdminManagement } from './components/AdminManagement';
import { ElectionCharts } from './components/ElectionCharts';
import { LiveResults } from './components/LiveResults';
import { CountdownTimer } from '../../shared/components/CountdownTimer';
import { UsersIcon, CheckCircleIcon, UserGroupIcon, ChartBarIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export const AdminDashboard: React.FC = () => {
  const { showError } = useNotification();
  const electionState = useElection();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'verifications' | 'candidates' | 'categories' | 'election' | 'admins'>('dashboard');
  const [stats, setStats] = useState({ users: 0, votes: 0, pending: 0, categories: 0 });
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (admin) {
      loadDashboardData();
    }
  }, [admin]);

  // Refresh data when election state changes
  useEffect(() => {
    if (admin) {
      loadDashboardData();
    }
  }, [electionState.status]);

  const loadDashboardData = async () => {
    try {
      const [pendingData, candidatesData, categoriesData] = await Promise.all([
        adminService.getPendingUsers(),
        votingService.getCandidates(),
        categoryService.getCategories()
      ]);
      setPendingUsers(pendingData);
      setCandidates(candidatesData);
      setCategories(categoriesData);
      setStats({
        users: candidatesData.length,
        votes: candidatesData.reduce((sum, c) => sum + c.voteCount, 0),
        pending: pendingData.length,
        categories: categoriesData.length
      });
    } catch (error: any) {
      showError(error.message || 'Failed to load dashboard data');
    }
  };

  const handleLogin = async (data: AdminLoginForm) => {
    setIsLoading(true);
    try {
      const adminUser = await authService.loginAdmin(data);
      setAdmin(adminUser);
    } catch (error: any) {
      showError(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setAdmin(null);
    setActiveTab('dashboard');
  };

  if (!admin) {
    return <AdminLogin onSubmit={handleLogin} isLoading={isLoading} />;
  }

  const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: number; icon: any; color: string }) => (
    <div className="bg-slate-800 rounded-lg p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="text-2xl md:text-3xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );

  const getElectionStatusColor = () => {
    switch (electionState.status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'ended': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  const getElectionStatusText = () => {
    switch (electionState.status) {
      case 'active': return 'LIVE';
      case 'paused': return 'PAUSED';
      case 'ended': return 'ENDED';
      default: return 'INACTIVE';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'verifications':
        return <PendingVerifications users={pendingUsers} onUpdate={loadDashboardData} />;
      case 'candidates':
        return <CandidateManagement candidates={candidates} categories={categories} onUpdate={loadDashboardData} />;
      case 'categories':
        return <CategoryManagement />;
      case 'election':
        return <ElectionControls />;
      case 'admins':
        return admin.role === 'super_admin' ? <AdminManagement /> : (
          <div className="bg-slate-800 rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-lg font-semibold text-white mb-2">Access Restricted</h3>
            <p className="text-slate-400">This section is only available to super administrators.</p>
          </div>
        );
      default:
        const rankings = calculateRankings(candidates);
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard 
                title="Total Candidates" 
                value={stats.users} 
                icon={UserGroupIcon} 
                color="bg-blue-500/20 text-blue-400" 
              />
              <StatCard 
                title="Total Votes" 
                value={stats.votes} 
                icon={CheckCircleIcon} 
                color="bg-green-500/20 text-green-400" 
              />
              <StatCard 
                title="Pending Verifications" 
                value={stats.pending} 
                icon={UsersIcon} 
                color="bg-yellow-500/20 text-yellow-400" 
              />
              <StatCard 
                title="Categories" 
                value={stats.categories} 
                icon={ChartBarIcon} 
                color="bg-purple-500/20 text-purple-400" 
              />
            </div>

            {/* Main Dashboard Content */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <LiveResults rankings={rankings} />
              </div>
              <div className="space-y-6">
                {/* Election Status & Countdown */}
                <div className="bg-slate-800 rounded-lg p-4 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Election Status</h3>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getElectionStatusColor()}`}>
                      {getElectionStatusText()}
                    </div>
                  </div>
                  
                  {electionState.status === 'active' && electionState.endTime ? (
                    <div>
                      <p className="text-sm text-slate-400 mb-3">Time Remaining</p>
                      <CountdownTimer 
                        targetDate={electionState.endTime}
                        isActive={true}
                        isPaused={false}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="text-2xl mb-2">
                        {electionState.status === 'ended' ? '🏁' : 
                         electionState.status === 'paused' ? '⏸️' : '⏹️'}
                      </div>
                      <p className="text-sm text-slate-400">
                        {electionState.status === 'ended' ? 'Election has concluded' :
                         electionState.status === 'paused' ? 'Election is paused' :
                         'Election not started'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Required Alert */}
                {stats.pending > 0 && (
                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-400 mb-2">Action Required</h4>
                    <p className="text-sm text-yellow-200 mb-3">
                      {stats.pending} user{stats.pending !== 1 ? 's' : ''} waiting for verification
                    </p>
                    <button
                      onClick={() => setActiveTab('verifications')}
                      className="w-full px-3 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-sm font-medium transition-colors min-h-[44px]"
                    >
                      Review Verifications
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Charts */}
            <ElectionCharts candidates={candidates} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 bg-slate-800 border-b border-slate-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl md:text-2xl font-bold text-white">Admin Dashboard</h1>
            
            {/* Live Election Indicator */}
            {electionState.status === 'active' && electionState.endTime && (
              <div className="hidden md:flex items-center space-x-3 bg-green-900/30 border border-green-500/30 rounded-lg px-3 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="text-sm">
                  <span className="text-green-400 font-medium">LIVE:</span>
                  <span className="text-white ml-2">
                    {Math.floor((new Date(electionState.endTime).getTime() - Date.now()) / (1000 * 60 * 60))}h {Math.floor(((new Date(electionState.endTime).getTime() - Date.now()) % (1000 * 60 * 60)) / (1000 * 60))}m left
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm text-slate-300">{admin.username}</p>
              <p className="text-xs text-slate-400">
                {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors min-h-[44px]"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-800/50 px-4 py-2 border-b border-slate-700">
        <div className="max-w-7xl mx-auto">
          <div className="flex space-x-1 overflow-x-auto pb-2">
            {[
              { key: 'dashboard', label: 'Dashboard', icon: '📊' },
              { key: 'verifications', label: 'Verifications', icon: '✅', badge: stats.pending > 0 ? stats.pending : null },
              { key: 'candidates', label: 'Candidates', icon: '👥' },
              { key: 'categories', label: 'Categories', icon: '📂' },
              { key: 'election', label: 'Election', icon: '🗳️' },
              ...(admin.role === 'super_admin' ? [{ key: 'admins', label: 'Admins', icon: '👨💼' }] : [])
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`relative flex items-center space-x-2 px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap min-h-[44px] ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};