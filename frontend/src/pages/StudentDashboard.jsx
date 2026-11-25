import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudentSidebar } from '../components/navigation/StudentSidebar';
import { EventCard } from '../components/events/EventCard';
import { 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Compass, 
  Bookmark, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const StudentDashboard = () => {
  const { currentUser, events, registrations, navigateTo, cancelRegistration } = useApp();

  // Filter registrations for current student
  const studentRegs = registrations.filter(
    r => r.studentId === currentUser?.studentId && r.status !== 'Cancelled'
  );

  // Map to full event objects
  const registeredEvents = studentRegs.map(reg => {
    const event = events.find(e => e.id === reg.eventId);
    return { ...event, registration: reg };
  }).filter(e => e.id); // filter out if event was deleted

  // Upcoming vs completed, based on the real current date.
  const totalRegisteredCount = registeredEvents.length;
  const upcomingCount = registeredEvents.filter(e => new Date(e.startDate) >= new Date()).length;
  const completedCount = Math.max(0, totalRegisteredCount - upcomingCount);

  // Recommended events (events the user has NOT registered for yet)
  const registeredIds = studentRegs.map(r => r.eventId);
  const recommendedEvents = events.filter(e => !registeredIds.includes(e.id)).slice(0, 3);

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-5rem)] bg-[#F8F9FC]">
      {/* Sidebar */}
      <StudentSidebar activeTab="overview" />

      {/* Main Dashboard Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Welcome Greeting Banner */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 transform skew-x-12 pointer-events-none"></div>
          
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-md mb-3">
              Student Workspace &middot; {currentUser?.college || "University Faculty"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
              Welcome back, {currentUser?.name || "Student"}! 👋
            </h1>
            <p className="text-indigo-100 text-sm leading-relaxed mb-6">
              You have <strong className="text-white underline">{upcomingCount} upcoming event{upcomingCount === 1 ? '' : 's'}</strong> scheduled on your calendar. Stay sharp and explore more peer-led workshops.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigateTo('explore')}
                className="px-4 py-2.5 rounded-xl bg-white text-indigo-700 font-bold text-xs shadow-md hover:bg-indigo-50 transition-all flex items-center gap-1.5"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Campus Events</span>
              </button>
              <button
                onClick={() => navigateTo('student-registrations')}
                className="px-4 py-2.5 rounded-xl bg-indigo-500/30 hover:bg-indigo-500/40 text-white font-semibold text-xs border border-white/20 transition-all"
              >
                View Registered Passes
              </button>
            </div>
          </div>
        </div>

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Registered</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{totalRegisteredCount}</h3>
              <p className="text-xs text-indigo-600 font-semibold mt-1">Confirmed student seats</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming Events</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{upcomingCount}</h3>
              <p className="text-xs text-emerald-600 font-semibold mt-1">Upcoming on your calendar</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Events</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{completedCount}</h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">Certificates earned</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Upcoming Registrations List */}
        <section className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Upcoming Registered Events</h2>
              <p className="text-xs text-slate-500">Your personal schedule and entry badges</p>
            </div>
            {registeredEvents.length > 0 && (
              <button 
                onClick={() => navigateTo('student-registrations')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>View all passes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {registeredEvents.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-700">No active event registrations</h4>
              <p className="text-xs text-slate-500 mt-1 mb-4">You have not registered for any upcoming events yet.</p>
              <button
                onClick={() => navigateTo('explore')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow"
              >
                Explore Events Now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {registeredEvents.slice(0, 3).map((event) => (
                <div 
                  key={event.id}
                  className="p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 bg-white hover:bg-slate-50/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img 
                      src={event.banner} 
                      alt={event.title}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100">
                          {event.category}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Registered
                        </span>
                      </div>
                      <h4 
                        onClick={() => navigateTo('event-details', { eventId: event.id })}
                        className="text-sm font-bold text-slate-900 hover:text-indigo-600 cursor-pointer line-clamp-1"
                      >
                        {event.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" /> {event.startDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> {event.venue}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => navigateTo('event-details', { eventId: event.id })}
                      className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Cancel registration for ${event.title}?`)) {
                          cancelRegistration(event.registration.id);
                        }
                      }}
                      className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recommended Events Section */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recommended for You</h2>
              <p className="text-xs text-slate-500">Events matching your student interests</p>
            </div>
            <button 
              onClick={() => navigateTo('explore')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>Explore all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>

        {/* Recent Activity Log */}
        <section className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-4">Recent Account Activity</h2>
          <div className="space-y-3">
            {studentRegs.slice(0, 3).map((reg) => {
              const ev = events.find(e => e.id === reg.eventId);
              return (
                <div key={reg.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 text-xs">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-800">
                      Confirmed registration for <strong className="font-semibold text-slate-900">{ev ? ev.title : 'Campus Event'}</strong>
                    </p>
                    <span className="text-[11px] text-slate-400">{reg.registeredAt}</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Active Pass
                  </span>
                </div>
              );
            })}
          </div>
        </section>

      </main>
    </div>
  );
};
