import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudentSidebar } from '../components/navigation/StudentSidebar';
import { Modal } from '../components/common/FeedbackComponents';
import { 
  Calendar, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  ArrowRight, 
  Search, 
  Filter, 
  Bookmark, 
  Compass,
  Download
} from 'lucide-react';

export const MyRegistrationsPage = () => {
  const { 
    currentUser, 
    registrations, 
    events, 
    cancelRegistration, 
    navigateTo, 
    savedEventIds,
    toggleSaveEvent,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'completed' | 'cancelled' | 'saved'
  const [searchTerm, setSearchTerm] = useState('');
  const [cancellingRegistration, setCancellingRegistration] = useState(null);

  // Student's registrations
  const studentRegs = registrations.filter(r => r.studentId === currentUser?.studentId);

  // Map to rich items
  const richItems = studentRegs.map(reg => {
    const event = events.find(e => e.id === reg.eventId);
    return {
      ...event,
      registrationId: reg.id,
      registeredAt: reg.registeredAt,
      regStatus: reg.status
    };
  }).filter(item => item.id);

  // Categorize
  const today = new Date();
  const upcomingRegs = richItems.filter(item => item.regStatus === 'Confirmed' && new Date(item.startDate) >= today);
  const completedRegs = richItems.filter(item => item.regStatus === 'Confirmed' && new Date(item.startDate) < today);
  const cancelledRegs = richItems.filter(item => item.regStatus === 'Cancelled');

  // Saved events list
  const savedEventsList = events.filter(e => savedEventIds.includes(e.id));

  // Determine current active list
  let currentList = [];
  if (activeTab === 'upcoming') currentList = upcomingRegs;
  else if (activeTab === 'completed') currentList = completedRegs;
  else if (activeTab === 'cancelled') currentList = cancelledRegs;
  else if (activeTab === 'saved') currentList = savedEventsList;

  // Filter with search
  const filteredList = currentList.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExecuteCancel = () => {
    if (cancellingRegistration) {
      cancelRegistration(cancellingRegistration.registrationId);
      setCancellingRegistration(null);
    }
  };

  const handleDownloadPass = async (item) => {
    const pass = [
      'CAMPUSCONNECT ENTRY PASS',
      item.title,
      `${item.startDate} · ${item.startTime}`,
      item.venue,
      `Pass ID: ${item.registrationId || item.id}`,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(pass);
      showToast('Entry pass details copied to your clipboard.', 'success');
    } catch (_error) {
      showToast('Clipboard unavailable in this browser.', 'error');
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-5rem)] bg-[#F8F9FC]">
      <StudentSidebar activeTab="registrations" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              My Event Passes & Registrations
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage your confirmed university passes, attendance badges, and bookmark collections
            </p>
          </div>

          <button
            onClick={() => navigateTo('explore')}
            className="self-start sm:self-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4" />
            <span>Discover More Events</span>
          </button>
        </div>

        {/* Tab & Search Toolbar */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Category / Status Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                  activeTab === 'upcoming' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>Upcoming Events</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'upcoming' ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {upcomingRegs.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('completed')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                  activeTab === 'completed' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>Completed</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'completed' ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {completedRegs.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('cancelled')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                  activeTab === 'cancelled' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>Cancelled</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'cancelled' ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {cancelledRegs.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('saved')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                  activeTab === 'saved' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Saved Bookmarks</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'saved' ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {savedEventsList.length}
                </span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search registered events..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600 transition-all"
              />
            </div>

          </div>
        </div>

        {/* Content List */}
        {filteredList.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm max-w-md mx-auto space-y-3">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">
              No {activeTab} passes found
            </h3>
            <p className="text-xs text-slate-500">
              {activeTab === 'upcoming' 
                ? 'You have no upcoming registered events at this time.' 
                : activeTab === 'saved' 
                ? 'You have not saved any events to your collection.' 
                : `There are no events listed under the ${activeTab} section.`}
            </p>
            <button
              onClick={() => navigateTo('explore')}
              className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow transition-all"
            >
              Explore Campus Events
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredList.map((item) => (
              <div
                key={item.registrationId || item.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
              >
                {/* Event summary info */}
                <div className="flex items-start sm:items-center gap-4">
                  <img
                    src={item.banner}
                    alt={item.title}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 shadow-sm"
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {item.category}
                      </span>

                      {item.regStatus === 'Confirmed' && (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Confirmed Pass
                        </span>
                      )}

                      {item.regStatus === 'Cancelled' && (
                        <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Cancelled
                        </span>
                      )}

                      {activeTab === 'saved' && (
                        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          Saved Event
                        </span>
                      )}
                    </div>

                    <h3 
                      onClick={() => navigateTo('event-details', { eventId: item.id })}
                      className="text-base font-bold text-slate-900 hover:text-indigo-600 cursor-pointer line-clamp-1 transition-colors"
                    >
                      {item.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> {item.startDate} &middot; {item.startTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {item.venue}
                      </span>
                    </div>

                    {item.registeredAt && (
                      <p className="text-[11px] text-slate-400 mt-1">
                        Registered on: {item.registeredAt}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => navigateTo('event-details', { eventId: item.id })}
                    className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    View Event
                  </button>

                  {item.regStatus === 'Confirmed' && (
                    <>
                      <button
                        onClick={() => handleDownloadPass(item)}
                        title="Download digital pass ticket"
                        className="px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Ticket</span>
                      </button>

                      <button
                        onClick={() => setCancellingRegistration(item)}
                        className="px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      >
                        Cancel Pass
                      </button>
                    </>
                  )}

                  {activeTab === 'saved' && (
                    <button
                      onClick={() => toggleSaveEvent(item.id)}
                      className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    >
                      Remove Bookmark
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* CANCELLATION CONFIRMATION MODAL */}
      <Modal
        isOpen={!!cancellingRegistration}
        onClose={() => setCancellingRegistration(null)}
        title="Cancel Event Pass"
      >
        {cancellingRegistration && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-800">
                <strong className="block font-bold">Release your reserved seat?</strong>
                This action will revoke your attendance pass for <span className="font-bold underline">{cancellingRegistration.title}</span>. Your slot will be allocated to another student.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setCancellingRegistration(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Nevermind, keep pass
              </button>
              <button
                onClick={handleExecuteCancel}
                className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition-all"
              >
                Yes, Cancel Pass
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};
