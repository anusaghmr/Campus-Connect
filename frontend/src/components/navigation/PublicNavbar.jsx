import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Compass, 
  Bookmark, 
  User, 
  Calendar, 
  LayoutDashboard, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X,
  PlusCircle,
  Users
} from 'lucide-react';

export const PublicNavbar = () => {
  const { currentPage, navigateTo, currentUser, userRole, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div 
            onClick={() => navigateTo('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">Campus<span className="text-indigo-600">Connect</span></span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 uppercase tracking-wide">University</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => navigateTo('landing')}
              className={`text-sm font-semibold transition-colors ${currentPage === 'landing' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
            >
              Home
            </button>
            <button 
              onClick={() => navigateTo('explore')}
              className={`text-sm font-semibold transition-colors ${currentPage === 'explore' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
            >
              Explore Events
            </button>
            <a 
              href="#about-section"
              onClick={(e) => {
                if (currentPage !== 'landing') {
                  e.preventDefault();
                  navigateTo('landing');
                  setTimeout(() => {
                    document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }}
              className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
            >
              About
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigateTo(userRole === 'admin' ? 'admin-dashboard' : 'student-dashboard')}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all border border-indigo-100"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{userRole === 'admin' ? 'Admin Portal' : 'My Dashboard'}</span>
                </button>
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-200"
                  />
                  <button 
                    onClick={logout}
                    title="Log out"
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => navigateTo('login')}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  Login
                </button>
                <button 
                  onClick={() => navigateTo('register')}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition-all hover:shadow-lg active:scale-95"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <button 
            onClick={() => { navigateTo('landing'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-indigo-50"
          >
            Home
          </button>
          <button 
            onClick={() => { navigateTo('explore'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-indigo-50"
          >
            Explore Events
          </button>
          <button
            onClick={() => {
              navigateTo('landing');
              setMobileMenuOpen(false);
              setTimeout(() => document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-indigo-50"
          >
            About
          </button>
          <div className="pt-3 border-t border-slate-100 space-y-2">
            {currentUser ? (
              <>
                <button
                  onClick={() => { 
                    navigateTo(userRole === 'admin' ? 'admin-dashboard' : 'student-dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-4 text-center rounded-xl font-semibold bg-indigo-50 text-indigo-600 text-sm"
                >
                  Go to {userRole === 'admin' ? 'Admin Dashboard' : 'Student Dashboard'}
                </button>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 px-4 text-center rounded-xl font-semibold text-rose-600 hover:bg-rose-50 text-sm"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { navigateTo('login'); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 text-center rounded-xl font-semibold text-slate-700 border border-slate-200 text-sm"
                >
                  Login
                </button>
                <button
                  onClick={() => { navigateTo('register'); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 text-center rounded-xl font-bold text-white bg-indigo-600 text-sm shadow-md"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
