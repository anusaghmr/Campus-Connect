import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/common/FeedbackComponents';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Mail, 
  Share2, 
  Bookmark, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck,
  Building,
  CheckCircle2,
  CalendarCheck
} from 'lucide-react';

export const EventDetailsPage = () => {
  const { 
    selectedEventId, 
    events, 
    navigateTo, 
    currentUser, 
    registrations, 
    registerForEvent, 
    cancelRegistration, 
    savedEventIds, 
    toggleSaveEvent,
    showToast 
  } = useApp();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Find the selected event
  const event = events.find(e => e.id === selectedEventId) || events[0];

  if (!event) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-800">Event Not Found</h2>
          <button 
            onClick={() => navigateTo('explore')} 
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
          >
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  // Registration states
  const userRegistration = currentUser ? registrations.find(
    r => r.eventId === event.id && r.studentId === currentUser.studentId && r.status !== 'Cancelled'
  ) : null;
  const isRegistered = !!userRegistration;
  const isFull = event.registeredCount >= event.maxParticipants;
  const isSaved = savedEventIds.includes(event.id);
  const remainingSeats = Math.max(0, event.maxParticipants - event.registeredCount);
  const percentageOccupied = Math.round((event.registeredCount / event.maxParticipants) * 100);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Event link copied to clipboard!', 'info');
  };

  const handleConfirmRegistration = () => {
    registerForEvent(event.id);
    setShowConfirmModal(false);
  };

  const handleConfirmCancel = () => {
    if (userRegistration) {
      cancelRegistration(userRegistration.id);
      setShowCancelModal(false);
    }
  };

  return (
    <div className="bg-[#F8F9FC] min-h-[calc(100vh-5rem)] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Navigation Bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateTo('explore')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Events</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 bg-white hover:bg-slate-50 text-slate-600 rounded-xl border border-slate-200 shadow-sm transition-colors text-xs font-semibold flex items-center gap-1.5"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button
              onClick={() => toggleSaveEvent(event.id)}
              className={`p-2 rounded-xl border shadow-sm transition-colors text-xs font-semibold flex items-center gap-1.5 ${
                isSaved 
                  ? 'bg-indigo-600 text-white border-indigo-600' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-indigo-600'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Hero Banner Section */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 mb-8 max-h-[460px] bg-slate-900">
          <img 
            src={event.banner} 
            alt={event.title} 
            className="w-full h-80 sm:h-96 md:h-[420px] object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

          {/* Banner Floating Info */}
          <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 text-white space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 text-xs font-bold rounded-lg bg-indigo-600/90 backdrop-blur-md uppercase tracking-wider text-white shadow-sm">
                {event.category}
              </span>
              {event.featured && (
                <span className="px-3 py-1 text-xs font-bold rounded-lg bg-amber-500 text-white flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" /> Featured Spotlight
                </span>
              )}
              {isRegistered && (
                <span className="px-3 py-1 text-xs font-bold rounded-lg bg-emerald-500 text-white flex items-center gap-1 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Registered Attendee
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight max-w-4xl">
              {event.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-200 pt-1">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-300" />
                {event.startDate} {event.endDate !== event.startDate ? `to ${event.endDate}` : ''}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-300" />
                {event.startTime} - {event.endTime}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-300" />
                {event.venue}
              </span>
            </div>
          </div>
        </div>

        {/* Content Layout Grid (Main info vs Sidebar sticky CTA) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Info Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Detailed Description */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-900">About the Event</h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Event Agenda & Schedule */}
            {event.agenda && event.agenda.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Schedule & Agenda</h2>
                    <p className="text-xs text-slate-500">Planned itinerary for attendees</p>
                  </div>
                  <CalendarCheck className="w-5 h-5 text-indigo-600" />
                </div>

                <div className="relative pl-6 border-l-2 border-indigo-100 space-y-6">
                  {event.agenda.map((item, idx) => (
                    <div key={idx} className="relative group">
                      <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-indigo-600 ring-4 ring-indigo-50"></div>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {item.time}
                      </span>
                      <h4 className="text-sm font-bold text-slate-800 mt-1">{item.title}</h4>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Eligibility & Guidelines */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Eligibility & Guidelines</h2>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50">
                  <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 block text-xs uppercase tracking-wide">Participant Qualification</strong>
                    <span className="text-xs">{event.eligibility || "Open to all enrolled university students with valid student ID."}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50">
                  <Building className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 block text-xs uppercase tracking-wide">Venue Code of Conduct</strong>
                    <span className="text-xs">Entry passes required at the venue desk. Please arrive 15 minutes prior to scheduled start time.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Organizer Profile */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Event Organizer</h2>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-extrabold text-xl">
                  {event.organizer.charAt(0)}
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">{event.organizer}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Campus Student Organization / Department Chapter</p>
                  <a 
                    href={`mailto:${event.organizerEmail || 'contact@campus.edu'}`}
                    className="inline-flex items-center gap-1.5 text-xs text-indigo-600 font-semibold hover:underline mt-1"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{event.organizerEmail || 'contact@campus.edu'}</span>
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar Sticky Registration Box */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xl space-y-6">
              
              {/* Registration Status Banner */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Seats Occupancy</span>
                  <span className="text-xs font-bold text-slate-900">{event.registeredCount} / {event.maxParticipants}</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      isFull ? 'bg-rose-500' : percentageOccupied > 80 ? 'bg-amber-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${Math.min(100, percentageOccupied)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-xs mt-2">
                  <span className={`font-bold ${isFull ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {isFull ? 'Registration Full' : `${remainingSeats} seats remaining`}
                  </span>
                  <span className="text-slate-400 font-medium">
                    Deadline: {event.registrationDeadline}
                  </span>
                </div>
              </div>

              {/* Event Details Quick Summary */}
              <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" /> Date
                  </span>
                  <strong className="text-slate-800">{event.startDate}</strong>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" /> Time
                  </span>
                  <strong className="text-slate-800">{event.startTime}</strong>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" /> Venue
                  </span>
                  <strong className="text-slate-800 text-right truncate max-w-[150px]">{event.venue}</strong>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" /> Capacity
                  </span>
                  <strong className="text-slate-800">{event.maxParticipants} students</strong>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-slate-400" /> Admission
                  </span>
                  <strong className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">Free Access</strong>
                </div>
              </div>

              {/* Primary Action Button */}
              <div className="pt-2">
                {isRegistered ? (
                  <div className="space-y-2">
                    <div className="w-full py-3.5 px-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs text-center flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>You are registered for this event!</span>
                    </div>
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="w-full py-2.5 px-4 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
                    >
                      Cancel My Registration
                    </button>
                  </div>
                ) : isFull ? (
                  <div>
                    <button
                      disabled
                      className="w-full py-4 px-4 rounded-2xl bg-slate-100 text-slate-400 font-bold text-sm cursor-not-allowed text-center"
                    >
                      Registration Full
                    </button>
                    <p className="text-[11px] text-slate-400 text-center mt-2">
                      All seats have been filled by students.
                    </p>
                  </div>
                ) : (
                  <div>
                    <button
                      onClick={() => {
                        if (!currentUser) {
                          navigateTo('login');
                          showToast('Please login to register for this event', 'info');
                        } else {
                          setShowConfirmModal(true);
                        }
                      }}
                      className="w-full py-4 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/40 transition-all active:scale-95 text-center"
                    >
                      Register Now
                    </button>
                    <p className="text-[11px] text-slate-400 text-center mt-2">
                      Instant confirmation & e-ticket generation
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* CONFIRM REGISTRATION MODAL */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Event Registration"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex gap-4 items-center">
            <img 
              src={event.banner} 
              alt={event.title} 
              className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-sm"
            />
            <div>
              <h4 className="text-sm font-bold text-slate-900">{event.title}</h4>
              <p className="text-xs text-slate-600 mt-1">
                📅 {event.startDate} &middot; {event.startTime}
              </p>
              <p className="text-xs text-slate-500">📍 {event.venue}</p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Registered Student:</span>
              <span className="font-bold text-slate-800">{currentUser?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Student ID:</span>
              <span className="font-bold text-slate-800">{currentUser?.studentId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Department:</span>
              <span className="font-semibold text-slate-700">{currentUser?.college}</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            By confirming your reservation, your seat will be reserved and an attendance pass will be generated under your student profile.
          </p>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmRegistration}
              className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all"
            >
              Confirm Registration
            </button>
          </div>
        </div>
      </Modal>

      {/* CANCEL REGISTRATION MODAL */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Event Registration"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-800">
              <strong className="block font-bold">Are you sure you want to cancel your registration?</strong>
              Your seat will be relinquished and made available to other students on the waitlist.
            </div>
          </div>

          <p className="text-xs text-slate-600">
            Event: <strong className="text-slate-900">{event.title}</strong>
          </p>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => setShowCancelModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Keep My Registration
            </button>
            <button
              onClick={handleConfirmCancel}
              className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition-all"
            >
              Yes, Cancel Seat
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
