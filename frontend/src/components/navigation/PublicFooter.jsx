import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Mail, ExternalLink } from 'lucide-react';

export const PublicFooter = () => {
  const { navigateTo } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">Campus<span className="text-indigo-400">Connect</span></span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              The unified student event management platform. Empowering university students to discover, organize, and lead meaningful campus experiences.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Platform Active &middot; Spring 2026 Academic Term
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Discover</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => navigateTo('explore')} className="hover:text-white transition-colors">
                  All Events
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('explore')} className="hover:text-white transition-colors">
                  Hackathons & Tech
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('explore')} className="hover:text-white transition-colors">
                  Campus Sports
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('explore')} className="hover:text-white transition-colors">
                  Cultural Festivals
                </button>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => navigateTo('login')} className="hover:text-white transition-colors">
                  Student Login
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('register')} className="hover:text-white transition-colors">
                  Join CampusConnect
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('admin-dashboard')} className="hover:text-white transition-colors flex items-center gap-1.5 text-indigo-400">
                  Admin Portal <ExternalLink className="w-3 h-3" />
                </button>
              </li>
              <li>
                <a href="#about-section" className="hover:text-white transition-colors">
                  About the Platform
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Contact</h4>
            <a href="mailto:hello@campusconnect.edu" className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors mb-4">
              <Mail className="w-4 h-4" />
              hello@campusconnect.edu
            </a>
            <div className="flex items-center gap-2">
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400 hover:text-white hover:bg-indigo-600 transition-colors">
                IG
              </a>
              <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400 hover:text-white hover:bg-indigo-600 transition-colors">
                FB
              </a>
              <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400 hover:text-white hover:bg-indigo-600 transition-colors">
                in
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 CampusConnect. University Student Event Platform. MERN Architecture Design.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Campus Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
