import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  LayoutDashboard, 
  CalendarRange, 
  PlusCircle, 
  Users, 
  GraduationCap, 
  LogOut, 
  ChevronRight,
  Shield,
  ArrowLeft
} from 'lucide-react';

export const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const { navigateTo, currentUser, logout, events, registrations } = useApp();

  const totalEvents = events.length;
  const totalRegs = registrations.filter(r => r.status !== 'Cancelled').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, page: 'admin-dashboard' },
    { id: 'manage-events', label: 'Manage Events', icon: CalendarRange, page: 'admin-events', badge: totalEvents },
    { id: 'create-event', label: 'Create Event', icon: PlusCircle, page: 'admin-create-event' },
    { id: 'registrations', label: 'Registrations', icon: Users, page: 'admin-registrations', badge: totalRegs },
    { id: 'students', label: 'Students', icon: GraduationCap, page: 'admin-registrations' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 min-h-[calc(100vh-5rem)]">
      <div>
        {/* Admin Badge Header */}
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Shield className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-white truncate">Administrator</h4>
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Admin Console
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <div className="p-4 space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
            Campus Management
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (setActiveTab) setActiveTab(item.id);
                  if (item.page) navigateTo(item.page);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                    isActive ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Switch to Student Portal & Logout */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <button
          onClick={() => navigateTo('student-dashboard')}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
        >
          <span className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4 text-indigo-400" />
            Switch to Student View
          </span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Admin Session</span>
        </button>
      </div>
    </aside>
  );
};
