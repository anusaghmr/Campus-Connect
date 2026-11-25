import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AdminSidebar } from '../components/navigation/AdminSidebar';
import { CATEGORIES } from '../data/initialData';
import { 
  Sparkles, 
  Upload, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Mail, 
  Building, 
  Save, 
  X, 
  ArrowLeft,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';

export const CreateEventPage = () => {
  const { events, editingEventId, setEditingEventId, saveEvent, navigateTo, showToast } = useApp();

  const isEditing = Boolean(editingEventId);
  const existingEvent = isEditing ? events.find(e => e.id === editingEventId) : null;

  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    category: 'Technology',
    banner: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    startDate: '',
    endDate: '',
    startTime: '10:00 AM',
    endTime: '04:00 PM',
    venue: '',
    organizer: '',
    organizerEmail: '',
    maxParticipants: 100,
    registrationDeadline: '',
    eligibility: 'Open to all enrolled university students',
    status: 'Published'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (existingEvent) {
      setFormData({
        title: existingEvent.title || '',
        shortDescription: existingEvent.shortDescription || '',
        description: existingEvent.description || '',
        category: existingEvent.category || 'Technology',
        banner: existingEvent.banner || '',
        startDate: existingEvent.startDate || '',
        endDate: existingEvent.endDate || '',
        startTime: existingEvent.startTime || '',
        endTime: existingEvent.endTime || '',
        venue: existingEvent.venue || '',
        organizer: existingEvent.organizer || '',
        organizerEmail: existingEvent.organizerEmail || '',
        maxParticipants: existingEvent.maxParticipants || 100,
        registrationDeadline: existingEvent.registrationDeadline || '',
        eligibility: existingEvent.eligibility || 'Open to all enrolled university students',
        status: existingEvent.status || 'Published'
      });
    }
  }, [existingEvent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Event title is required';
    if (!formData.description.trim()) newErrors.description = 'Detailed description is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.venue.trim()) newErrors.venue = 'Venue location is required';
    if (!formData.organizer.trim()) newErrors.organizer = 'Organizer name is required';
    if (!formData.maxParticipants || formData.maxParticipants <= 0) newErrors.maxParticipants = 'Participant capacity must be greater than 0';
    if (!formData.registrationDeadline) newErrors.registrationDeadline = 'Registration deadline is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (statusToSet = 'Published') => {
    if (!validate()) {
      showToast('Please fix the errors in the event form', 'error');
      return;
    }

    const payload = {
      ...formData,
      status: statusToSet,
      maxParticipants: Number(formData.maxParticipants),
      endDate: formData.endDate || formData.startDate,
      id: isEditing ? existingEvent.id : undefined,
      registeredCount: isEditing ? existingEvent.registeredCount : 0
    };

    saveEvent(payload);
    setEditingEventId(null);
    navigateTo('admin-events');
  };

  const sampleBannerOptions = [
    { label: "Conference / Tech", url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80" },
    { label: "Hackathon / Code", url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80" },
    { label: "Workshop / Seminar", url: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80" },
    { label: "Sports Championship", url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80" },
    { label: "Creative Arts", url: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80" }
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-5rem)] bg-[#F8F9FC]">
      <AdminSidebar activeTab="create-event" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditingEventId(null);
                navigateTo('admin-events');
              }}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-700 shadow-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {isEditing ? 'Edit Campus Event' : 'Create New Campus Event'}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {isEditing ? `Modifying event listing: ${existingEvent?.title}` : 'Publish a new workshop, hackathon, seminar, or competition'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => {
                setEditingEventId(null);
                navigateTo('admin-events');
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 bg-white shadow-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSave('Draft')}
              className="px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition-all"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => handleSave('Published')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Update Event' : 'Publish Event'}</span>
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          
          {/* 1. Basic Event Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-indigo-600 flex items-center gap-2">
              <span>1. Basic Information</span>
            </h3>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Annual Inter-Collegiate Robotics Olympiad 2026"
                className={`w-full px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                  errors.title ? 'border-rose-400' : 'border-slate-200 focus:border-indigo-600'
                }`}
              />
              {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
            </div>

            {/* Category & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-600 bg-white"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Publishing Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-600 bg-white"
                >
                  <option value="Published">Published (Public)</option>
                  <option value="Draft">Draft (Hidden)</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            {/* Short Tagline */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Short Summary (Card Preview)
              </label>
              <input
                type="text"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                placeholder="One concise sentence explaining the core purpose of this event"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-600"
              />
            </div>

            {/* Full Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Detailed Event Description *
              </label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide complete breakdown, what students will learn or experience, expectations, and instructions..."
                className={`w-full px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none transition-all ${
                  errors.description ? 'border-rose-400' : 'border-slate-200 focus:border-indigo-600'
                }`}
              ></textarea>
              {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
            </div>
          </div>

          {/* 2. Banner Preview & Image URL */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-indigo-600 flex items-center gap-2">
              <span>2. Event Banner & Media</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Image Banner URL
              </label>
              <input
                type="url"
                name="banner"
                value={formData.banner}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-600"
              />
            </div>

            {/* Quick banner presets */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-slate-400">Presets:</span>
              {sampleBannerOptions.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setFormData({ ...formData, banner: opt.url })}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold"
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Image live preview */}
            {formData.banner && (
              <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                <img
                  src={formData.banner}
                  alt="Live Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-black/60 text-white text-[11px] font-bold backdrop-blur-md flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" /> Live Banner Preview
                </div>
              </div>
            )}
          </div>

          {/* 3. Schedule & Location */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-indigo-600 flex items-center gap-2">
              <span>3. Date, Time & Venue</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium focus:outline-none ${
                    errors.startDate ? 'border-rose-400' : 'border-slate-200 focus:border-indigo-600'
                  }`}
                />
                {errors.startDate && <p className="text-xs text-rose-500 mt-1">{errors.startDate}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Start Time
                </label>
                <input
                  type="text"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  placeholder="e.g. 10:00 AM"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  End Time
                </label>
                <input
                  type="text"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  placeholder="e.g. 04:00 PM"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Campus Venue / Hall *
              </label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="e.g. Turing Auditorium, Building 4"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium focus:outline-none ${
                  errors.venue ? 'border-rose-400' : 'border-slate-200 focus:border-indigo-600'
                }`}
              />
              {errors.venue && <p className="text-xs text-rose-500 mt-1">{errors.venue}</p>}
            </div>
          </div>

          {/* 4. Capacity, Organizer & Criteria */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-indigo-600 flex items-center gap-2">
              <span>4. Capacity & Registration Rules</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Max Participants (Capacity) *
                </label>
                <input
                  type="number"
                  name="maxParticipants"
                  min="1"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium focus:outline-none ${
                    errors.maxParticipants ? 'border-rose-400' : 'border-slate-200 focus:border-indigo-600'
                  }`}
                />
                {errors.maxParticipants && <p className="text-xs text-rose-500 mt-1">{errors.maxParticipants}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Registration Deadline *
                </label>
                <input
                  type="date"
                  name="registrationDeadline"
                  value={formData.registrationDeadline}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium focus:outline-none ${
                    errors.registrationDeadline ? 'border-rose-400' : 'border-slate-200 focus:border-indigo-600'
                  }`}
                />
                {errors.registrationDeadline && <p className="text-xs text-rose-500 mt-1">{errors.registrationDeadline}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Organizer Society / Department *
                </label>
                <input
                  type="text"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleChange}
                  placeholder="e.g. ACM Student Chapter"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium focus:outline-none ${
                    errors.organizer ? 'border-rose-400' : 'border-slate-200 focus:border-indigo-600'
                  }`}
                />
                {errors.organizer && <p className="text-xs text-rose-500 mt-1">{errors.organizer}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Organizer Contact Email
                </label>
                <input
                  type="email"
                  name="organizerEmail"
                  value={formData.organizerEmail}
                  onChange={handleChange}
                  placeholder="society@campus.edu"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Eligibility Criteria
              </label>
              <input
                type="text"
                name="eligibility"
                value={formData.eligibility}
                onChange={handleChange}
                placeholder="e.g. Open to all undergraduate & postgraduate students"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setEditingEventId(null);
                navigateTo('admin-events');
              }}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSave('Draft')}
              className="px-5 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition-all"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => handleSave('Published')}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isEditing ? 'Update & Publish' : 'Publish Campus Event'}</span>
            </button>
          </div>

        </div>

      </main>
    </div>
  );
};
