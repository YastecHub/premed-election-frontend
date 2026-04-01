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
import { Users, CheckCircle, UserCheck, BarChart3, LogOut, Lock, Flag, Pause, Square, LayoutDashboard, FolderOpen, Vote, UserCog, ChevronLeft, Home } from 'lucide-react';

interface AdminDashboardProps {
  onBack?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const { showError } = useNotification();
  const electionState = useElection();
  const [admin, setAdmin] = useState<Admin | null>(() => {
    try { return JSON.parse(sessionStorage.getItem('elec_admin') || 'null'); }
    catch { return null; }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'verifications' | 'candidates' | 'categories' | 'election' | 'admins'>(() => {
    const saved = sessionStorage.getItem('elec_admin_tab');
    const valid = ['dashboard', 'verifications', 'candidates', 'categories', 'election', 'admins'];
    return (valid.includes(saved!) ? saved : 'dashboard') as any;
  });
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

  // Persist admin session and active tab across refreshes
  useEffect(() => {
    if (admin) sessionStorage.setItem('elec_admin', JSON.stringify(admin));
    else sessionStorage.removeItem('elec_admin');
  }, [admin]);

  useEffect(() => {
    sessionStorage.setItem('elec_admin_tab', activeTab);
  }, [activeTab]);

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
    sessionStorage.removeItem('elec_admin');
    setActiveTab('dashboard');
  };

  if (!admin) {
    return (
      <div className="relative">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="fixed top-4 left-4 z-50 flex items-center gap-1.5 text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors min-h-[44px] px-3 py-2 bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-700/50"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </button>
        )}
        <AdminLogin onSubmit={handleLogin} isLoading={isLoading} />
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color, glow }: { title: string; value: number; icon: any; color: string; glow?: string }) => (
    <div className={`relative overflow-hidden rounded-xl p-4 border border-zinc-700/50 bg-zinc-900 transition-all duration-200 hover:border-zinc-600/70 group`}>
      {glow && <div className={`pointer-events-none absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-20 group-hover:opacity-35 transition-opacity ${glow}`} />}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-zinc-500 font-medium truncate mb-2 uppercase tracking-wider">{title}</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tabular-nums">{value}</p>
        </div>
        <div className={`p-2.5 rounded-lg flex-shrink-0 ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );

  const getElectionStatusColor = () => {
    switch (electionState.status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'ended': return 'bg-red-500';
      default: return 'bg-zinc-500';
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
          <div className="bento-card p-8 text-center">
            <div className="flex justify-center mb-4">
              <Lock className="h-12 w-12 text-zinc-500" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-100 mb-2">Access Restricted</h3>
            <p className="text-zinc-400">This section is only available to super administrators.</p>
          </div>
        );
      default:
        const rankings = calculateRankings(candidates);
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Stats Bento */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard
                title="Candidates"
                value={stats.users}
                icon={Users}
                color="bg-violet-500/15 text-violet-400"
                glow="bg-violet-500"
              />
              <StatCard
                title="Total Votes"
                value={stats.votes}
                icon={CheckCircle}
                color="bg-emerald-500/15 text-emerald-400"
                glow="bg-emerald-500"
              />
              <StatCard
                title="Pending"
                value={stats.pending}
                icon={UserCheck}
                color="bg-amber-500/15 text-amber-400"
                glow="bg-amber-500"
              />
              <StatCard
                title="Categories"
                value={stats.categories}
                icon={BarChart3}
                color="bg-cyan-500/15 text-cyan-400"
                glow="bg-cyan-500"
              />
            </div>

            {/* Main Dashboard Content */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
              <div className="xl:col-span-2">
                <LiveResults rankings={rankings} />
              </div>
              <div className="space-y-4 sm:space-y-6">
                {/* Election Status & Countdown */}
                <div className="bento-card p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm sm:text-base font-semibold text-zinc-100">Election Status</h3>
                    <div className={`px-2.5 py-1 rounded-full text-xs font-bold text-white ${getElectionStatusColor()}`}>
                      {getElectionStatusText()}
                    </div>
                  </div>

                  {electionState.status === 'active' && electionState.endTime ? (
                    <div>
                      <p className="text-xs text-zinc-500 mb-3 uppercase tracking-wider">Time Remaining</p>
                      <CountdownTimer
                        targetDate={electionState.endTime}
                        isActive={true}
                        isPaused={false}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="mb-2 flex justify-center">
                        {electionState.status === 'ended' ? <Flag className="h-8 w-8 text-zinc-600" /> :
                         electionState.status === 'paused' ? <Pause className="h-8 w-8 text-zinc-600" /> :
                         <Square className="h-8 w-8 text-zinc-600" />}
                      </div>
                      <p className="text-sm text-zinc-500">
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
                      type="button"
                      onClick={() => setActiveTab('verifications')}
                      className="w-full px-3 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg text-sm font-semibold transition-colors min-h-[44px]"
                      aria-label="Review pending verifications"
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 bg-zinc-900/95 backdrop-blur-xl border-b border-zinc-700/50 px-3 sm:px-4 py-3">
        <div className="max-w-7xl mx-auto">
          {/* Top row: Title and Logout */}
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-base sm:text-lg md:text-xl font-bold text-zinc-100 truncate">Admin Dashboard</h1>
            <div className="flex items-center gap-2 flex-shrink-0">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="flex items-center gap-1 px-3 py-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg text-xs sm:text-sm font-medium transition-colors min-h-[44px]"
                  aria-label="Back to Home"
                >
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">Home</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-xs sm:text-sm font-medium transition-colors min-h-[44px]"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
          
          {/* Bottom row: User info and Live indicator */}
          <div className="mt-2 flex items-center justify-between">
            <div className="flex-1">
              {/* Live Election Indicator */}
              {electionState.status === 'active' && electionState.endTime && (
                <div className="flex items-center space-x-2 bg-green-900/30 border border-green-500/30 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 max-w-fit">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0"></div>
                  <div className="text-xs sm:text-sm">
                    <span className="text-green-400 font-medium">LIVE:</span>
                    <span className="text-white ml-1 sm:ml-2">
                      {Math.floor((new Date(electionState.endTime).getTime() - Date.now()) / (1000 * 60 * 60))}h {Math.floor(((new Date(electionState.endTime).getTime() - Date.now()) % (1000 * 60 * 60)) / (1000 * 60))}m
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="text-right text-xs sm:text-sm flex-shrink-0">
              <p className="text-zinc-300">{admin.username}</p>
              <p className="text-xs text-zinc-500">
                {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Tab Bar — hidden on mobile */}
      <div className="hidden sm:block bg-zinc-900/60 border-b border-zinc-700/50 overflow-x-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto px-3 py-2">
          <div className="flex space-x-1 min-w-max">
            {[
              { key: 'dashboard',     label: 'Dashboard',     icon: LayoutDashboard },
              { key: 'verifications', label: 'Verifications', icon: CheckCircle, badge: stats.pending > 0 ? stats.pending : null },
              { key: 'candidates',    label: 'Candidates',    icon: Users },
              { key: 'categories',    label: 'Categories',    icon: FolderOpen },
              { key: 'election',      label: 'Election',      icon: Vote },
              ...(admin.role === 'super_admin' ? [{ key: 'admins', label: 'Admins', icon: UserCog }] : []),
            ].map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  type="button"
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`relative px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap min-h-[44px] flex items-center space-x-2 flex-shrink-0 ${
                    activeTab === tab.key
                      ? 'bg-violet-600 text-white shadow-sm shadow-violet-500/20'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                  aria-label={tab.label}
                >
                  <IconComponent className="h-4 w-4 flex-shrink-0" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 pb-24 sm:pb-6 bg-zinc-950 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {renderTabContent()}
        </div>
      </div>

      {/* Mobile Bottom Dock — visible on small screens only */}
      <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-700/50">
        <div className="grid grid-cols-5 h-16">
          {[
            { key: 'dashboard',     label: 'Home',    icon: LayoutDashboard },
            { key: 'verifications', label: 'Verify',  icon: UserCheck,  badge: stats.pending > 0 ? stats.pending : null },
            { key: 'candidates',    label: 'Cands',   icon: Users },
            { key: 'election',      label: 'Election',icon: Vote },
            { key: 'categories',    label: 'Cats',    icon: FolderOpen },
          ].map(tab => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                type="button"
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`relative flex flex-col items-center justify-center gap-0.5 transition-colors ${
                  isActive ? 'text-violet-400' : 'text-zinc-500 hover:text-zinc-300'
                }`}
                aria-label={tab.label}
              >
                <div className="relative">
                  <IconComponent className="h-5 w-5" />
                  {tab.badge && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] rounded-full h-3.5 w-3.5 flex items-center justify-center font-bold">
                      {tab.badge > 9 ? '9+' : tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[9px] font-semibold">{tab.label}</span>
                {isActive && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-violet-400" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};