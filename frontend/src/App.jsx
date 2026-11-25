import React from 'react';
import { useApp } from './context/AppContext';
import { PublicNavbar } from './components/navigation/PublicNavbar';
import { PublicFooter } from './components/navigation/PublicFooter';
import { ToastNotification } from './components/common/FeedbackComponents';
import { Sparkles } from 'lucide-react';

// Generation 1 Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { StudentRegistrationPage } from './pages/StudentRegistrationPage';

// Generation 2 Pages
import { StudentDashboard } from './pages/StudentDashboard';
import { ExploreEventsPage } from './pages/ExploreEventsPage';

// Generation 3 Pages
import { EventDetailsPage } from './pages/EventDetailsPage';
import { MyRegistrationsPage } from './pages/MyRegistrationsPage';
import { StudentProfilePage } from './pages/StudentProfilePage';

// Generation 4 Pages
import { AdminDashboard } from './pages/AdminDashboard';
import { ManageEventsPage } from './pages/ManageEventsPage';

// Generation 5 Pages
import { CreateEventPage } from './pages/CreateEventPage';
import { RegistrationManagementPage } from './pages/RegistrationManagementPage';

export function App() {
  const { currentPage, toast, loading, apiError, refreshData } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#F8F9FC]">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg animate-pulse">
          <Sparkles className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-slate-500">
          Loading CampusConnect from the server…
        </p>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentPage) {
      // Generation 1
      case 'landing':
        return <LandingPage />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <StudentRegistrationPage />;
      // Generation 2
      case 'student-dashboard':
        return <StudentDashboard />;
      case 'explore':
        return <ExploreEventsPage />;
      // Generation 3
      case 'event-details':
        return <EventDetailsPage />;
      case 'student-registrations':
        return <MyRegistrationsPage />;
      case 'student-profile':
        return <StudentProfilePage />;
      // Generation 4
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'admin-events':
        return <ManageEventsPage />;
      // Generation 5
      case 'admin-create-event':
        return <CreateEventPage />;
      case 'admin-registrations':
        return <RegistrationManagementPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FC] font-sans text-slate-800">
      {/* Universal Responsive Navbar */}
      <PublicNavbar />

      {/* Backend connectivity warning (only shown when the API is unreachable) */}
      {apiError && (
        <div className="bg-rose-50 border-b border-rose-200 text-rose-800 px-4 py-2.5 text-xs flex flex-wrap items-center justify-center gap-3">
          <span>{apiError}</span>
          <button onClick={refreshData} className="font-bold underline hover:no-underline">
            Retry
          </button>
        </div>
      )}

      {/* Main Page Content */}
      <div className="flex-1">{renderContent()}</div>

      {/* Global Toast System */}
      <ToastNotification toast={toast} />

      {/* Universal Footer */}
      <PublicFooter />
    </div>
  );
}

export default App;
