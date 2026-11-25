import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { AdminSidebar } from '../components/navigation/AdminSidebar';
import { CATEGORIES } from '../data/initialData';
import { Modal } from '../components/common/FeedbackComponents';
import { 
  Search, 
  PlusCircle, 
  Edit, 
  Trash2, 
  Eye, 
  Filter, 
  AlertTriangle,
  Calendar, 
  MapPin, 
  Users, 
  CheckCircle, 
  FileText,
  X
} from 'lucide-react';

export const ManageEventsPage = () => {
  const { events, deleteEvent, navigateTo } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [eventToDelete, setEventToDelete] = useState(null);

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchSearch = 
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.organizer.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory = selectedCategory === 'All' || e.category === selectedCategory;
      const matchStatus = selectedStatus === 'All' || e.status === selectedStatus;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [events, searchTerm, selectedCategory, selectedStatus]);

  const handleDeleteConfirm = () => {
    if (eventToDelete) {
      deleteEvent(eventToDelete.id);
      setEventToDelete(null);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-5rem)] bg-[#F8F9FC]">
      <AdminSidebar activeTab="manage-events" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Manage Campus Events
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Create, modify, archive, and monitor capacity across all collegiate event listings
            </p>
          </div>

          <button
            onClick={() => navigateTo('admin-create-event')}
            className="self-start sm:self-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Event</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search */}
            <div className="sm:col-span-6 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search events by title, venue, organizer..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:bg-white focus:outline-none focus:border-indigo-600 transition-all"
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

            {/* Category */}
            <div className="sm:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:bg-white focus:outline-none focus:border-indigo-600 font-medium text-slate-700"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="sm:col-span-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:bg-white focus:outline-none focus:border-indigo-600 font-medium text-slate-700"
              >
                <option value="All">All Statuses</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events Table Container */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              Campus Event Directory ({filteredEvents.length})
            </h3>
            <span className="text-xs text-slate-400">Sort by creation date</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-5">Event & Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Venue</th>
                  <th className="py-3.5 px-4">Registrations</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-400">
                      No events found matching your search and filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map(event => {
                    const isFull = event.registeredCount >= event.maxParticipants;
                    return (
                      <tr key={event.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Event & Details */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <img
                              src={event.banner}
                              alt={event.title}
                              className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-sm"
                            />
                            <div>
                              <h4 
                                onClick={() => navigateTo('event-details', { eventId: event.id })}
                                className="font-bold text-slate-900 hover:text-indigo-600 cursor-pointer truncate max-w-[200px]"
                              >
                                {event.title}
                              </h4>
                              <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                                By {event.organizer}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold text-[11px]">
                            {event.category}
                          </span>
                        </td>

                        {/* Date & Time */}
                        <td className="py-4 px-4 text-slate-600">
                          <div className="font-medium text-slate-900">{event.startDate}</div>
                          <div className="text-[11px] text-slate-400">{event.startTime}</div>
                        </td>

                        {/* Venue */}
                        <td className="py-4 px-4 text-slate-600 truncate max-w-[140px]">
                          {event.venue}
                        </td>

                        {/* Registrations */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{event.registeredCount}</span>
                            <span className="text-slate-400">/ {event.maxParticipants}</span>
                          </div>
                          <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                            <div
                              className={`h-1.5 rounded-full ${isFull ? 'bg-rose-500' : 'bg-indigo-600'}`}
                              style={{ width: `${Math.min(100, Math.round((event.registeredCount / event.maxParticipants) * 100))}%` }}
                            ></div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            event.status === 'Published' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : event.status === 'Draft'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {event.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => navigateTo('event-details', { eventId: event.id })}
                              title="Preview event page"
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => navigateTo('admin-create-event', { editEventId: event.id })}
                              title="Edit event details"
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEventToDelete(event)}
                              title="Delete event"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={!!eventToDelete}
        onClose={() => setEventToDelete(null)}
        title="Delete Campus Event"
      >
        {eventToDelete && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-800">
                <strong className="block font-bold">This action cannot be undone.</strong>
                Are you sure you want to delete <span className="font-bold underline">{eventToDelete.title}</span>? All student registrations associated with this event will also be removed.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setEventToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition-all"
              >
                Yes, Delete Event
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};
