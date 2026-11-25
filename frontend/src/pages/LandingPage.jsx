import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EventCard } from '../components/events/EventCard';
import { Modal } from '../components/common/FeedbackComponents';
import { CATEGORIES } from '../data/initialData';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Search, 
  Calendar, 
  Award, 
  Users, 
  Building, 
  ShieldCheck, 
  TrendingUp,
  Cpu,
  Layers,
  GraduationCap
} from 'lucide-react';

export const LandingPage = () => {
  const { events, navigateTo, registerForEvent, currentUser } = useApp();
  const [selectedEventToRegister, setSelectedEventToRegister] = useState(null);

  // Pick top 3-4 featured events and derive showcase figures from the database.
  const featuredEvents = events.filter(e => e.featured).slice(0, 4);
  const heroEvent = featuredEvents[0] || events[0];
  const totalCapacity = events.reduce((sum, e) => sum + (e.maxParticipants || 0), 0);
  const totalReserved = events.reduce((sum, e) => sum + (e.registeredCount || 0), 0);
  const occupancy = totalCapacity ? Math.round((totalReserved / totalCapacity) * 100) : 0;
  const categoryCount = new Set(events.map(e => e.category)).size;

  const categoryIcons = {
    Technology: <Cpu className="w-6 h-6 text-indigo-600" />,
    Workshops: <Layers className="w-6 h-6 text-purple-600" />,
    Sports: <TrendingUp className="w-6 h-6 text-emerald-600" />,
    Cultural: <Sparkles className="w-6 h-6 text-rose-600" />,
    Competitions: <Award className="w-6 h-6 text-amber-600" />,
    Seminars: <GraduationCap className="w-6 h-6 text-blue-600" />
  };

  const handleRegisterConfirm = () => {
    if (selectedEventToRegister) {
      registerForEvent(selectedEventToRegister.id);
      setSelectedEventToRegister(null);
    }
  };

  return (
    <div className="bg-[#F8F9FC]">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">
        {/* Soft background glow */}
        <div className="absolute top-16 right-0 w-72 h-72 bg-[#EEECFF] rounded-full blur-3xl opacity-70 -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold tracking-wide uppercase shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Next-Gen Campus Experience Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Your Campus. <br />
                Your Events. <br />
                <span className="text-indigo-600">
                  Your Community.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                CampusConnect brings university life right to your fingertips. Discover hackathons, academic seminars, sports championships, and arts galas with effortless one-click registration and real-time student tracking.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => navigateTo('explore')}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all flex items-center justify-center gap-2 group active:scale-95"
                >
                  <span>Explore Events</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => navigateTo('register')}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-200 shadow-sm hover:border-slate-300 transition-all active:scale-95"
                >
                  Join CampusConnect
                </button>
              </div>

              {/* Social Proof Stats Mini */}
              <div className="pt-6 border-t border-slate-200/80 flex items-center justify-center lg:justify-start gap-8 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Instant RSVP</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Verified Badges</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Organized Calendars</span>
                </div>
              </div>
            </div>

            {/* Right Graphic / Interactive Showcase Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Floating Highlight Badge */}
                <div className="absolute -top-6 -left-6 z-20 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-pulse">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                    {occupancy}%
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Seat Occupancy</div>
                    <div className="text-[10px] text-slate-500">Across {totalCapacity.toLocaleString()} campus seats</div>
                  </div>
                </div>

                {/* Hero Showcase Card */}
                <div className="bg-white rounded-3xl p-4 shadow-2xl border border-slate-100 transform lg:rotate-1 hover:rotate-0 transition-transform duration-500">
                  <div className="relative h-64 rounded-2xl overflow-hidden mb-4">
                    <img 
                      src={heroEvent?.banner} 
                      alt="Featured University Event" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <span className="px-2.5 py-1 text-[11px] font-bold bg-indigo-600 rounded-lg uppercase tracking-wide">
                        Live Highlight
                      </span>
                      <h4 className="text-lg font-bold mt-1 text-white">{heroEvent?.title || 'Upcoming Campus Event'}</h4>
                    </div>
                  </div>

                  <div className="space-y-3 px-2 pb-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500" /> {heroEvent?.startDate} &middot; {heroEvent?.venue}
                      </span>
                      <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {heroEvent?.registeredCount || 0} Registered
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {heroEvent?.shortDescription || 'Discover workshops, competitions and campus events open for registration.'}
                    </p>

                    <button 
                      onClick={() => navigateTo('explore')}
                      className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Browse All {events.length} Scheduled Events</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURED EVENTS SECTION */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase mb-2 block">
                Editor's Highlights
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Featured Campus Events
              </h2>
              <p className="text-slate-500 text-sm mt-2 max-w-xl">
                Explore handpicked workshops, competitive hackathons, and signature inter-college events with active open registrations.
              </p>
            </div>
            <button 
              onClick={() => navigateTo('explore')}
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <span>View all events</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                onRegisterClick={(evt) => setSelectedEventToRegister(evt)} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* EVENT CATEGORIES */}
      <section className="py-20 bg-[#F8F9FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase mb-2 block">
              Curated Streams
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore by Category
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Filter campus happenings by your field of interest, career ambitions, or extracurricular passions.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => (
              <div
                key={cat}
                onClick={() => navigateTo('explore')}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-indigo-300 hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-center text-center group"
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-50/60 group-hover:bg-indigo-100 flex items-center justify-center transition-colors mb-3">
                  {categoryIcons[cat] || <Sparkles className="w-6 h-6 text-indigo-600" />}
                </div>
                <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {cat}
                </h4>
                <span className="text-[11px] text-slate-400 mt-1">
                  {events.filter(e => e.category === cat).length} events
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="about-section" className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase mb-2 block">
              Streamlined Process
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              How CampusConnect Works
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Three simple steps to never miss another university milestone or networking summit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative p-8 rounded-2xl bg-slate-50/70 border border-slate-100 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-indigo-600/30 mb-6">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Discover Events</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Filter through comprehensive event listings by faculty, date, status, or category tags with instant search.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-8 rounded-2xl bg-slate-50/70 border border-slate-100 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-indigo-600/30 mb-6">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Register Online</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Secure your seat in seconds. Get verified participant credentials, real-time availability confirmation, and instant alerts.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-8 rounded-2xl bg-slate-50/70 border border-slate-100 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-indigo-600/30 mb-6">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Participate & Connect</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Attend workshops, network with corporate recruiters and fellow collegiate innovators, and enrich your academic journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STATISTICS */}
      <section className="py-16 bg-[#202338] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-indigo-800">
            <div className="p-4">
              <div className="text-4xl sm:text-5xl font-black text-indigo-300 mb-2">{events.length}</div>
              <div className="text-sm font-semibold uppercase tracking-wider text-slate-300">Events Listed</div>
              <div className="text-xs text-indigo-200 mt-1">Across technology, arts & sports</div>
            </div>

            <div className="p-4">
              <div className="text-4xl sm:text-5xl font-black text-indigo-300 mb-2">{totalReserved.toLocaleString()}</div>
              <div className="text-sm font-semibold uppercase tracking-wider text-slate-300">Seats Reserved</div>
              <div className="text-xs text-indigo-200 mt-1">Confirmed across all events</div>
            </div>

            <div className="p-4">
              <div className="text-4xl sm:text-5xl font-black text-indigo-300 mb-2">{categoryCount}</div>
              <div className="text-sm font-semibold uppercase tracking-wider text-slate-300">Event Categories</div>
              <div className="text-xs text-indigo-200 mt-1">Technology, arts, sports & more</div>
            </div>
          </div>
        </div>
      </section>

      {/* REGISTRATION MODAL */}
      <Modal
        isOpen={!!selectedEventToRegister}
        onClose={() => setSelectedEventToRegister(null)}
        title="Confirm Event Registration"
      >
        {selectedEventToRegister && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 flex gap-4 items-center">
              <img 
                src={selectedEventToRegister.banner} 
                alt={selectedEventToRegister.title} 
                className="w-16 h-16 rounded-xl object-cover shrink-0"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900">{selectedEventToRegister.title}</h4>
                <div className="text-xs text-slate-600 mt-1">
                  📅 {selectedEventToRegister.startDate} &middot; 📍 {selectedEventToRegister.venue}
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-2 bg-slate-50 p-3 rounded-lg">
              <div className="flex justify-between">
                <span className="text-slate-500">Student Name:</span>
                <span className="font-semibold text-slate-800">{currentUser?.name || 'Guest visitor'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Registration Fee:</span>
                <span className="font-semibold text-emerald-600">Free (Campus Sponsored)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Remaining Seats:</span>
                <span className="font-semibold text-indigo-600">
                  {selectedEventToRegister.maxParticipants - selectedEventToRegister.registeredCount} seats
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 italic">
              *By confirming, your attendance badge will be issued and seat reserved in your student dashboard.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedEventToRegister(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRegisterConfirm}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all"
              >
                Confirm My Seat
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
