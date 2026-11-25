import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Bookmark, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const EventCard = ({ event, onRegisterClick }) => {
  const { navigateTo, savedEventIds, toggleSaveEvent, registrations, currentUser } = useApp();

  const isSaved = savedEventIds.includes(event.id);
  const isRegistered = currentUser && registrations.some(
    r => r.eventId === event.id && r.studentId === currentUser.studentId && r.status !== 'Cancelled'
  );
  const isFull = event.registeredCount >= event.maxParticipants;
  const seatsLeft = Math.max(0, event.maxParticipants - event.registeredCount);

  // Category badge colors
  const categoryColors = {
    Technology: 'bg-blue-50 text-blue-700 border-blue-200',
    Competitions: 'bg-amber-50 text-amber-700 border-amber-200',
    Seminars: 'bg-purple-50 text-purple-700 border-purple-200',
    Sports: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Cultural: 'bg-rose-50 text-rose-700 border-rose-200',
    Workshops: 'bg-cyan-50 text-cyan-700 border-cyan-200'
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Thumbnail Banner */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img 
          src={event.banner} 
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border backdrop-blur-md ${categoryColors[event.category] || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
            {event.category}
          </span>
          {event.featured && (
            <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-amber-500 text-white flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3" /> Featured
            </span>
          )}
        </div>

        {/* Bookmark Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSaveEvent(event.id);
          }}
          title={isSaved ? "Remove bookmark" : "Bookmark event"}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all shadow-sm ${
            isSaved 
              ? 'bg-indigo-600 text-white' 
              : 'bg-white/80 text-slate-700 hover:bg-white hover:text-indigo-600'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Bottom Banner Info */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
          <span className="flex items-center gap-1.5 drop-shadow">
            <Calendar className="w-3.5 h-3.5 text-indigo-300" />
            {event.startDate}
          </span>
          <span className="flex items-center gap-1.5 drop-shadow">
            <Clock className="w-3.5 h-3.5 text-indigo-300" />
            {event.startTime}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>

          <h3 
            onClick={() => navigateTo('event-details', { eventId: event.id })}
            className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 cursor-pointer mb-2"
          >
            {event.title}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {event.shortDescription || event.description}
          </p>
        </div>

        {/* Footer & Registration Status */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          {/* Seat Status Indicator */}
          <div className="flex items-center gap-1.5 text-xs">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            {isFull ? (
              <span className="text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded-md">Full</span>
            ) : (
              <span className="text-slate-600 font-medium">
                <strong className="text-indigo-600 font-bold">{seatsLeft}</strong> seats left
              </span>
            )}
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateTo('event-details', { eventId: event.id })}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Details
            </button>
            {isRegistered ? (
              <span className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg">
                Registered ✓
              </span>
            ) : isFull ? (
              <button disabled className="px-3 py-1.5 text-xs font-semibold text-slate-400 bg-slate-100 rounded-lg cursor-not-allowed">
                Closed
              </button>
            ) : (
              <button
                onClick={() => onRegisterClick ? onRegisterClick(event) : navigateTo('event-details', { eventId: event.id })}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm hover:shadow transition-all"
              >
                Register
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
