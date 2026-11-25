import React from 'react';
import { useApp } from '../context/AppContext';
import { AdminSidebar } from '../components/navigation/AdminSidebar';
import { 
  CalendarRange, 
  Users, 
  GraduationCap, 
  CheckCircle2, 
  PlusCircle, 
  TrendingUp, 
  ArrowUpRight, 
  Clock, 
  Sparkles,
  BarChart2,
  PieChart,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

export const AdminDashboard = () => {
  const { navigateTo, stats, events } = useApp();

  // Every metric below is an aggregate computed by the backend from MongoDB.
  const metrics = stats || {
    totalEvents: 0,
    activeEvents: 0,
    totalRegistrations: 0,
    uniqueStudents: 0,
    categoryCounts: [],
    maxCategoryCount: 1,
    topCategory: '—',
    registrationTrends: [],
    maxTrend: 1,
    recentEvents: [],
    recentRegistrations: [],
  };
  const {
    totalEvents,
    activeEvents,
    totalRegistrations,
    uniqueStudents,
    categoryCounts,
    maxCategoryCount,
    topCategory,
    registrationTrends,
    maxTrend,
    recentEvents,
    recentRegistrations,
  } = metrics;

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-5rem)] bg-[#F8F9FC]">
      <AdminSidebar activeTab="dashboard" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Admin Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wide">
                Admin Console
              </span>
              <span className="text-xs text-slate-400">University System Status: Optimal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Event Management Overview
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('admin-registrations')}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-slate-400" />
              <span>View Registrations</span>
            </button>
            <button
              onClick={() => navigateTo('admin-create-event')}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Event</span>
            </button>
          </div>
        </div>

        {/* 4 Primary Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Events */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Events</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{totalEvents}</h3>
              <p className="text-xs text-indigo-600 font-semibold mt-1">Managed on platform</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <CalendarRange className="w-6 h-6" />
            </div>
          </div>

          {/* Active Events */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Events</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{activeEvents}</h3>
              <p className="text-xs text-emerald-600 font-semibold mt-1">Open for registrations</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          {/* Total Registrations */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Registrations</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{totalRegistrations}</h3>
              <p className="text-xs text-purple-600 font-semibold mt-1">Confirmed student passes</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Unique Students */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Enrolled Students</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{uniqueStudents}</h3>
              <p className="text-xs text-blue-600 font-semibold mt-1">Students with active passes</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <GraduationCap className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Visual Analytics Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Chart 1: Registrations Over Time */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                    <span>Student Registrations Growth</span>
                  </h3>
                  <p className="text-xs text-slate-500">Monthly student participation rate</p>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  Last 6 months
                </span>
              </div>

              {/* Bar Chart Visualization */}
              <div className="h-48 flex items-end gap-3 pt-6 pb-2 px-2">
                {registrationTrends.map((trend, idx) => {
                  const heightPercent = Math.round((trend.registrations / maxTrend) * 100);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <div className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">
                        {trend.registrations}
                      </div>
                      <div 
                        className="w-full bg-indigo-100 group-hover:bg-indigo-600 rounded-t-lg transition-all duration-300 relative"
                        style={{ height: `${heightPercent}%` }}
                      ></div>
                      <span className="text-[11px] font-semibold text-slate-500">{trend.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Updated real-time from registration collections</span>
              <span className="font-bold text-slate-800">Live from MongoDB</span>
            </div>
          </div>

          {/* Chart 2: Registrations by Event Category */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-purple-600" />
                    <span>Participation by Category</span>
                  </h3>
                  <p className="text-xs text-slate-500">Distribution across faculty streams</p>
                </div>
              </div>

              {/* Category Horizontal Bars */}
              <div className="space-y-3 pt-2">
                {categoryCounts.map((cat, idx) => {
                  const percent = Math.round((cat.count / maxCategoryCount) * 100);
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-700">{cat.category}</span>
                        <span className="font-bold text-slate-900">{cat.count} attendees</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
              <span>Top Category: <strong>{topCategory}</strong></span>
            </div>
          </div>

        </div>

        {/* Recent Events Table */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Campus Events</h3>
              <p className="text-xs text-slate-500">Quick oversight of latest scheduled and draft initiatives</p>
            </div>
            <button
              onClick={() => navigateTo('admin-events')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>Manage all events</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-y border-slate-100">
                <tr>
                  <th className="py-3 px-4">Event Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Event Date</th>
                  <th className="py-3 px-4">Registrations</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentEvents.map(event => (
                  <tr key={event.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-3">
                      <img 
                        src={event.banner} 
                        alt={event.title} 
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <span className="truncate max-w-[220px]">{event.title}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {event.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{event.startDate}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-800">{event.registeredCount}</span>
                      <span className="text-slate-400"> / {event.maxParticipants}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {event.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => navigateTo('event-details', { eventId: event.id })}
                        title="View event"
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigateTo('admin-create-event', { editEventId: event.id })}
                        title="Edit event"
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Registrations Table */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Student Registrations</h3>
              <p className="text-xs text-slate-500">Live feed of student event signups</p>
            </div>
            <button
              onClick={() => navigateTo('admin-registrations')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>View full student roster</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {recentRegistrations.map((reg) => {
              const ev = events.find(e => e.id === reg.eventId);
              return (
                <div key={reg.id} className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                      {reg.studentName ? reg.studentName.charAt(0) : 'S'}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{reg.studentName}</div>
                      <div className="text-[11px] text-slate-500">{reg.studentEmail} &middot; {reg.college}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold text-slate-800">{ev?.title || 'Campus Event'}</div>
                    <div className="text-[11px] text-slate-400">{reg.registeredAt}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
};
