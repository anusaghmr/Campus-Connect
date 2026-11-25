import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, User, Mail, Building, IdCard, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export const StudentRegistrationPage = () => {
  const { registerStudent, navigateTo } = useApp();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    studentId: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const collegeOptions = [
    "Faculty of Computer Engineering & Tech",
    "School of Information Systems & Computing",
    "Department of Design, Architecture & Media",
    "School of Business & Entrepreneurship",
    "Department of Biotechnology & Life Sciences",
    "Faculty of Physical Education & Sports"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Student email is required';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Enter a valid student email address';
    }
    if (!formData.college) newErrors.college = 'Please select your college/department';
    if (!formData.studentId.trim()) newErrors.studentId = 'Student ID is required';
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Create the real account through the API and transition to the dashboard.
    setIsSubmitting(true);
    await registerStudent(formData);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F8F9FC]">
      <div className="max-w-xl w-full">
        {/* Header */}
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
            Create your student account
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Join thousands of students building their skills and participating across campus
          </p>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Morgan"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                    errors.name ? 'border-rose-400' : 'border-slate-200 focus:border-indigo-600'
                  }`}
                />
              </div>
              {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
            </div>

            {/* Email & Student ID Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Student Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Student Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="student@campus.edu"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                      errors.email ? 'border-rose-400' : 'border-slate-200 focus:border-indigo-600'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
              </div>

              {/* Student ID */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Student ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <IdCard className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    placeholder="STU-2026-XXXX"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                      errors.studentId ? 'border-rose-400' : 'border-slate-200 focus:border-indigo-600'
                    }`}
                  />
                </div>
                {errors.studentId && <p className="text-xs text-rose-500 mt-1">{errors.studentId}</p>}
              </div>
            </div>

            {/* College / Department */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                College / Department
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Building className="w-4 h-4" />
                </div>
                <select
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                    errors.college ? 'border-rose-400' : 'border-slate-200 focus:border-indigo-600'
                  }`}
                >
                  <option value="">Select your department or faculty</option>
                  {collegeOptions.map((c, idx) => (
                    <option key={idx} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              {errors.college && <p className="text-xs text-rose-500 mt-1">{errors.college}</p>}
            </div>

            {/* Password & Confirm Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                      errors.password ? 'border-rose-400' : 'border-slate-200 focus:border-indigo-600'
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
                {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                      errors.confirmPassword ? 'border-rose-400' : 'border-slate-200 focus:border-indigo-600'
                    }`}
                  />
                </div>
                {errors.confirmPassword && <p className="text-xs text-rose-500 mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="pt-2 text-xs text-slate-500">
              By registering, you agree to university event participation rules and safety standards.
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>{isSubmitting ? 'Creating account…' : 'Create Student Account'}</span>
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <button
              onClick={() => navigateTo('login')}
              className="font-bold text-indigo-600 hover:underline ml-1"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
