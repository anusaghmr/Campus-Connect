import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck, User } from 'lucide-react';

export const LoginPage = () => {
  const { loginUser, navigateTo, showToast } = useApp();

  const [email, setEmail] = useState('anusha.g@campus.edu');
  const [password, setPassword] = useState('student2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [roleMode, setRoleMode] = useState('student'); // form mode only; role comes from the server
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuickFillStudent = () => {
    setRoleMode('student');
    setEmail('anusha.g@campus.edu');
    setPassword('student2026');
  };

  const handleQuickFillAdmin = () => {
    setRoleMode('admin');
    setEmail('admin.vance@campus.edu');
    setPassword('admin2026');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Email address is required';
    if (!password.trim()) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    // The server verifies the credentials and decides the actual role.
    await loginUser(roleMode, { email, password, rememberMe });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F8F9FC]">
      <div className="max-w-md w-full">
        {/* Card Header */}
        <div className="text-center mb-8">
          <div 
            onClick={() => navigateTo('landing')}
            className="inline-flex items-center gap-2 mb-4 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-slate-900">Campus<span className="text-indigo-600">Connect</span></span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Sign in to your account
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Access your registered events and campus activity
          </p>
        </div>

        {/* Demo Fast Login Pills */}
        <div className="bg-white p-3 rounded-2xl border border-indigo-100 shadow-sm mb-6 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-500 pl-2">One-Click Demo:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleQuickFillStudent}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                roleMode === 'student' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Student Demo
            </button>
            <button
              type="button"
              onClick={handleQuickFillAdmin}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                roleMode === 'admin' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Admin Demo
            </button>
          </div>
        </div>

        {/* Login Form Box */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role selector tab */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-4">
              <button
                type="button"
                onClick={() => setRoleMode('student')}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  roleMode === 'student' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Student</span>
              </button>
              <button
                type="button"
                onClick={() => setRoleMode('admin')}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  roleMode === 'admin' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Administrator</span>
              </button>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {roleMode === 'admin' ? 'Admin Email Address' : 'Student Email Address'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: null });
                  }}
                  placeholder="student@campus.edu"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                    errors.email ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-600'
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => showToast('Password resets are handled by campus administration. Please contact the admin office.', 'info')}
                  className="text-xs font-semibold text-indigo-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: null });
                  }}
                  placeholder="••••••••••••"
                  className={`w-full pl-10 pr-10 py-3 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                    errors.password ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.password}</p>}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="remember-me" className="ml-2.5 block text-xs font-medium text-slate-600 cursor-pointer">
                Remember my login credentials on this device
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span>{isSubmitting ? 'Signing in…' : `Sign In as ${roleMode === 'admin' ? 'Administrator' : 'Student'}`}</span>
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Switch to registration */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have a CampusConnect student profile?{' '}
            <button
              onClick={() => navigateTo('register')}
              className="font-bold text-indigo-600 hover:underline ml-1"
            >
              Register here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
