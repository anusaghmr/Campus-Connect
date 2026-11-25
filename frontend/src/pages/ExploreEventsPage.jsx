import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { EventCard } from '../components/events/EventCard';
import { CATEGORIES } from '../data/initialData';
import { Modal } from '../components/common/FeedbackComponents';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Calendar, 
  Building2, 
  Sparkles, 
  X,
  ArrowUpDown
} from 'lucide-react';

export const ExploreEventsPage = () => {
  const { events, registerForEvent, exploreCategory, setExploreCategory, searchEvents, showToast } = useApp();

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(exploreCategory || 'All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('upcoming'); // 'upcoming', 'popular', 'title'
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedEventToRegister, setSelectedEventToRegister] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSelectedCategory(exploreCategory || 'All');
  }, [exploreCategory]);

  // Search, filter and sort are executed by the backend against MongoDB.
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    searchEvents({
      search: searchTerm || undefined,
      category: selectedCategory === 'All' ? undefined : selectedCategory,
      seats: selectedStatus === 'All' ? undefined : selectedStatus,
      sort: sortBy,
    })
      .then((data) => {
        if (!cancelled) {
          setFilteredEvents(data);
          setVisibleCount(6);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setFilteredEvents([]);
          showToast(error.message, 'error');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // `events` is a dependency so seat counts refresh after registrations.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedCategory, selectedStatus, sortBy, events]);

  const displayedEvents = filteredEvents.slice(0, visibleCount);
  const hasMore = visibleCount < filteredEvents.length;

  const handleRegisterConfirm = () => {
    if (selectedEventToRegister) {
      registerForEvent(selectedEventToRegister.id);
      setSelectedEventToRegister(null);
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setExploreCategory('All');
    setSelectedStatus('All');
    setSortBy('upcoming');
  };

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'All' || selectedStatus !== 'All';

  return (
    <div className="bg-[#F8F9FC] min-h-[calc(100vh-5rem)] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Campus Life Directory</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore Campus Events
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Browse, search, and register for student initiatives, workshops, hackathons, and athletic championships.
            </p>
          </div>

          <div className="text-xs font-semibold text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm self-start md:self-auto">
            Showing <strong className="text-slate-900 font-bold">{filteredEvents.length}</strong> available event{filteredEvents.length === 1 ? '' : 's'}
          </div>
        </div>

        {/* Filter & Search Bar Toolbar */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by event title, organizer, or venue..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Dropdown */}
            <div className="md:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium text-slate-700"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Status Dropdown */}
            <div className="md:col-span-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium text-slate-700"
              >
                <option value="All">All Seats</option>
                <option value="Available">Seats Available</option>
                <option value="Full">Full / Closed</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium text-slate-700"
              >
                <option value="upcoming">Sort: Date (Nearest)</option>
                <option value="popular">Sort: Most Popular</option>
                <option value="title">Sort: Alphabetical</option>
              </select>
            </div>

          </div>

          {/* Category Quick Pills */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Filters:
              </span>
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedCategory === 'All' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedCategory === cat 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm max-w-lg mx-auto">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
            <h3 className="text-base font-bold text-slate-800">Loading events…</h3>
            <p className="text-xs text-slate-500 mt-1">Fetching the latest listings from the server.</p>
          </div>
        ) : displayedEvents.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm max-w-lg mx-auto">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No events found matching your criteria</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Try adjusting your search terms or clearing your category filters to view other activities.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow hover:bg-indigo-700 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                onRegisterClick={(evt) => setSelectedEventToRegister(evt)} 
              />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center pt-4">
            <button
              onClick={() => setVisibleCount(prev => prev + 3)}
              className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold shadow-sm hover:border-slate-300 transition-all"
            >
              Load More Events ({filteredEvents.length - visibleCount} remaining)
            </button>
          </div>
        )}

      </div>

      {/* REGISTRATION MODAL */}
      <Modal
        isOpen={!!selectedEventToRegister}
        onClose={() => setSelectedEventToRegister(null)}
        title="Event Registration Pass"
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
                <span className="text-slate-500">Event Organizer:</span>
                <span className="font-semibold text-slate-800">{selectedEventToRegister.organizer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Eligibility:</span>
                <span className="font-semibold text-slate-800">{selectedEventToRegister.eligibility}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Available Seats:</span>
                <span className="font-semibold text-indigo-600">
                  {selectedEventToRegister.maxParticipants - selectedEventToRegister.registeredCount} remaining
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedEventToRegister(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Dismiss
              </button>
              <button
                onClick={handleRegisterConfirm}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all"
              >
                Confirm Registration
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
