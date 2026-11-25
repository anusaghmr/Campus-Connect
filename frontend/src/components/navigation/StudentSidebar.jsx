import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  LayoutDashboard, 
  Compass, 
  ClipboardList, 
  Bookmark, 
  User, 
  LogOut, 
  ShieldCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export const StudentSidebar = ({ activeTab, setActiveTab }) => {
  const { navigateTo, currentUser, logout, registrations, savedEventIds } = useApp();

  const myRegCount = currentUser ? registrations.filter(r => r.studentId === currentUser.studentId && r.status !== 'Cancelled').length : 0;
  const savedCount = savedEventIds.length;

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, page: 'student-dashboard' },
    { id: 'explore', label: 'Explore Events', icon: Compass, page: 'explore' },
    { id: 'registrations', label: 'My Registrations', icon: ClipboardList, page: 'student-registrations', badge: myRegCount },
    { id: 'saved', label: 'Saved Events', icon: Bookmark, page: 'student-registrations', badge: savedCount },
    { id: 'profile', label: 'My Profile', icon: User, page: 'student-profile' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 min-h-[calc(100vh-5rem)]">
      <div>
        {/* User Mini Profile Header in Sidebar */}
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <img 
            src={currentUser?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80"} 
            alt="Student Avatar" 
            className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-100"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-slate-800 truncate">{currentUser?.name || 'Student User'}</h4>
            <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
              Verified Student
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <div className="p-4 space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Student Portal
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
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                    isActive ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Shortcuts & Logout */}
      <div className="p-4 border-t border-slate-100 space-y-2">
        {/* Switch to Admin Mode Shortcut */}
        <button
          onClick={() => navigateTo('admin-dashboard')}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl transition-colors"
        >
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            Switch to Admin View
          </span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
