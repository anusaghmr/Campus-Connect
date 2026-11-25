import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudentSidebar } from '../components/navigation/StudentSidebar';
import { Modal } from '../components/common/FeedbackComponents';
import { 
  User, 
  Mail, 
  Building, 
  IdCard, 
  ShieldCheck, 
  Key, 
  Camera, 
  Save, 
  CheckCircle,
  Calendar,
  Award
} from 'lucide-react';

export const StudentProfilePage = () => {
  const { currentUser, updateProfile, showToast, changePassword, registrations } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    college: currentUser?.college || '',
    studentId: currentUser?.studentId || '',
    bio: currentUser?.bio || '',
    avatar: currentUser?.avatar || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const studentRegs = registrations.filter(r => r.studentId === currentUser?.studentId && r.status !== 'Cancelled');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const saved = await updateProfile(formData);
    if (saved) setIsEditing(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword) {
      showToast('Please enter your current password', 'error');
      return;
    }
    if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
      showToast('New password must be at least 6 characters long', 'error');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    const changed = await changePassword(passwordData);
    if (changed) {
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    }
  };

  const handleAvatarChange = () => {
    const avatars = [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80"
    ];
    const nextAvatar = avatars[(avatars.indexOf(formData.avatar) + 1) % avatars.length] || avatars[0];
    setFormData(prev => ({ ...prev, avatar: nextAvatar }));
    updateProfile({ avatar: nextAvatar });
    showToast('Profile photo updated!', 'info');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-5rem)] bg-[#F8F9FC]">
      <StudentSidebar activeTab="profile" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Student Profile & Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your personal academic identity, university credentials, and security preferences
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          
          {/* Header Cover Bar */}
          <div className="h-32 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 relative"></div>

          {/* Profile Details Container */}
          <div className="px-6 pb-8 sm:px-8 relative">
            
            {/* Avatar & Action Top Row */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 mb-6 gap-4">
              <div className="relative group self-center sm:self-auto">
                <img
                  src={formData.avatar}
                  alt={formData.name}
                  className="w-28 h-28 rounded-3xl object-cover ring-4 ring-white shadow-xl bg-white"
                />
                <button
                  type="button"
                  onClick={handleAvatarChange}
                  title="Change avatar"
                  className="absolute bottom-1 right-1 p-2 rounded-xl bg-indigo-600 text-white shadow hover:bg-indigo-700 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3 self-center sm:self-auto">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowPasswordModal(true)}
                      className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5"
                    >
                      <Key className="w-3.5 h-3.5 text-slate-400" />
                      <span>Change Password</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all"
                    >
                      Edit Profile
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Profile Information View or Form */}
            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Student Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      College / Faculty
                    </label>
                    <input
                      type="text"
                      name="college"
                      value={formData.college}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Student ID Number
                    </label>
                    <input
                      type="text"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    About / Bio
                  </label>
                  <textarea
                    name="bio"
                    rows="3"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Brief student background, tech stack, or campus interests..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 font-medium resize-none"
                  ></textarea>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-slate-900">{formData.name}</h2>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">{formData.college}</p>
                </div>

                {formData.bio && (
                  <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                    {formData.bio}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                  <div className="p-4 rounded-2xl bg-slate-50">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Student ID
                    </span>
                    <strong className="text-sm text-slate-800">{formData.studentId}</strong>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Email Address
                    </span>
                    <strong className="text-sm text-slate-800 truncate block">{formData.email}</strong>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Account Status
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <CheckCircle className="w-3.5 h-3.5" /> Enrolled Student
                    </span>
                  </div>
                </div>

                {/* Participation stats badge banner */}
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Award className="w-6 h-6 text-indigo-600 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-indigo-900">Active Campus Engagement</h4>
                      <p className="text-[11px] text-indigo-700">Participating in {studentRegs.length} verified campus events</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 bg-white px-3 py-1.5 rounded-xl shadow-sm">
                    Verified Profile
                  </span>
                </div>
              </div>
            )}

          </div>
        </div>

      </main>

      {/* CHANGE PASSWORD MODAL */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Update Security Password"
      >
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              New Password
            </label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              placeholder="Minimum 6 characters"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordData.confirmNewPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
              placeholder="Confirm new password"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowPasswordModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all"
            >
              Update Password
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
