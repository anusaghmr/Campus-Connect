import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { AdminSidebar } from '../components/navigation/AdminSidebar';
import { Modal } from '../components/common/FeedbackComponents';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Mail, 
  Building, 
  IdCard,
  X,
  FileSpreadsheet
} from 'lucide-react';

export const RegistrationManagementPage = () => {
  const { registrations, events, cancelRegistration, showToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedRegistration, setSelectedRegistration] = useState(null);

  // Filter registrations
  const filteredRegistrations = useMemo(() => {
    return registrations.filter(reg => {
      const matchSearch = 
        reg.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.college.toLowerCase().includes(searchTerm.toLowerCase());

      const matchEvent = selectedEventId === 'All' || reg.eventId === selectedEventId;
      const matchStatus = selectedStatus === 'All' || reg.status === selectedStatus;

      return matchSearch && matchEvent && matchStatus;
    });
  }, [registrations, searchTerm, selectedEventId, selectedStatus]);

  // Export registrations data to CSV
  const handleExportCSV = () => {
    if (filteredRegistrations.length === 0) {
      showToast('No registrations to export', 'error');
      return;
    }

    const headers = ['Registration ID,Student Name,Email,Student ID,College,Event Title,Date,Status'];
    const rows = filteredRegistrations.map(r => {
      const ev = events.find(e => e.id === r.eventId);
      return `"${r.id}","${r.studentName}","${r.studentEmail}","${r.studentId}","${r.college}","${ev?.title || 'Unknown Event'}","${r.registeredAt}","${r.status}"`;
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `campusconnect-registrations-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Registration roster exported as CSV successfully!', 'success');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-5rem)] bg-[#F8F9FC]">
      <AdminSidebar activeTab="registrations" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Event Registrations Management
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Audit student participant rosters, verify entry eligibility, and export attendance records
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="self-start sm:self-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/25 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Roster (CSV)</span>
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            
            {/* Student Search */}
            <div className="sm:col-span-6 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by student name, ID, email, or department..."
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

            {/* Event Filter */}
            <div className="sm:col-span-3">
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:bg-white focus:outline-none focus:border-indigo-600 font-medium text-slate-700"
              >
                <option value="All">All Events</option>
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>{ev.title}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="sm:col-span-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:bg-white focus:outline-none focus:border-indigo-600 font-medium text-slate-700"
              >
                <option value="All">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

          </div>
        </div>

        {/* Registrations Roster Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              Registered Attendees ({filteredRegistrations.length})
            </h3>
            <span className="text-xs text-slate-400">Real-time database sync</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-5">Student Name</th>
                  <th className="py-3.5 px-4">Student ID</th>
                  <th className="py-3.5 px-4">Event</th>
                  <th className="py-3.5 px-4">Department / Faculty</th>
                  <th className="py-3.5 px-4">Registration Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-400">
                      No registrations found matching the specified parameters.
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map(reg => {
                    const event = events.find(e => e.id === reg.eventId);
                    return (
                      <tr key={reg.id} className="hover:bg-slate-50/70 transition-colors">
                        
                        {/* Student Name & Email */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                              {reg.studentName ? reg.studentName.charAt(0) : 'S'}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{reg.studentName}</div>
                              <div className="text-[11px] text-slate-400">{reg.studentEmail}</div>
                            </div>
                          </div>
                        </td>

                        {/* Student ID */}
                        <td className="py-4 px-4 font-mono font-semibold text-slate-700">
                          {reg.studentId}
                        </td>

                        {/* Event Title */}
                        <td className="py-4 px-4">
                          <span className="font-semibold text-slate-900 block truncate max-w-[180px]">
                            {event?.title || 'Unknown Event'}
                          </span>
                          <span className="text-[11px] text-slate-400 block">
                            {event?.category || 'Campus Stream'}
                          </span>
                        </td>

                        {/* Department */}
                        <td className="py-4 px-4 text-slate-600 truncate max-w-[160px]">
                          {reg.college}
                        </td>

                        {/* Date */}
                        <td className="py-4 px-4 text-slate-500 text-[11px]">
                          {reg.registeredAt}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            reg.status === 'Confirmed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {reg.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => setSelectedRegistration({ ...reg, eventTitle: event?.title })}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                          >
                            Details
                          </button>
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

      {/* REGISTRATION DETAIL MODAL */}
      <Modal
        isOpen={!!selectedRegistration}
        onClose={() => setSelectedRegistration(null)}
        title="Student Registration Details"
      >
        {selectedRegistration && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center shrink-0">
                {selectedRegistration.studentName.charAt(0)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{selectedRegistration.studentName}</h4>
                <p className="text-xs text-slate-600">{selectedRegistration.studentEmail}</p>
                <span className="text-[10px] font-mono font-bold text-indigo-700 bg-white px-2 py-0.5 rounded mt-1 inline-block">
                  ID: {selectedRegistration.studentId}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Event Title:</span>
                <span className="font-bold text-slate-900 text-right truncate max-w-[220px]">
                  {selectedRegistration.eventTitle}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Department:</span>
                <span className="font-semibold text-slate-800 text-right truncate max-w-[220px]">
                  {selectedRegistration.college}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Registration Time:</span>
                <span className="font-semibold text-slate-700">{selectedRegistration.registeredAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pass Status:</span>
                <span className="font-bold text-emerald-600">{selectedRegistration.status}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              {selectedRegistration.status === 'Confirmed' && (
                <button
                  onClick={() => {
                    if (confirm(`Cancel pass for ${selectedRegistration.studentName}?`)) {
                      cancelRegistration(selectedRegistration.id);
                      setSelectedRegistration(null);
                    }
                  }}
                  className="px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl"
                >
                  Revoke Student Pass
                </button>
              )}
              <button
                onClick={() => setSelectedRegistration(null)}
                className="px-5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};
