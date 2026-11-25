import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import {
  authApi,
  eventsApi,
  registrationsApi,
  usersApi,
  dashboardApi,
} from '../services';
import { getToken, setToken } from '../services/api';

const AppContext = createContext();

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80';
const DEFAULT_AGENDA = [
  { time: '10:00 AM', title: 'Opening & Introduction' },
  { time: '12:00 PM', title: 'Core Session & Demonstrations' },
  { time: '03:00 PM', title: 'Interactive Workshop & Wrap-up' },
];

export const AppProvider = ({ children }) => {
  // Navigation & page state (unchanged from the original application)
  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [editingEventId, setEditingEventId] = useState(null);
  const [exploreCategory, setExploreCategory] = useState('All');

  // Authentication state
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState('guest');

  // Database-backed data
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [savedEventIds, setSavedEventIds] = useState([]);
  const [stats, setStats] = useState(null);

  // Request state
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = (message, type = 'success') => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), message, type });
    toastTimer.current = setTimeout(() => setToast(null), 3800);
  };

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  /** Internal navigation used after login/register, where the role is known. */
  const goToPage = (page, params = {}) => {
    if (params.eventId) setSelectedEventId(params.eventId);
    if (params.editEventId !== undefined) setEditingEventId(params.editEventId);
    if (params.category) setExploreCategory(params.category);
    else if (page === 'explore') setExploreCategory('All');
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /** Public navigation — admin pages are protected by the real user role. */
  const navigateTo = (page, params = {}) => {
    if (page.startsWith('admin-') && userRole !== 'admin') {
      showToast('Administrator access is required for this page.', 'error');
      return;
    }
    goToPage(page, params);
  };

  const hydrateUser = (user) => {
    const normalized = { ...user, avatar: user.avatar || DEFAULT_AVATAR };
    setCurrentUser(normalized);
    setUserRole(normalized.role || 'guest');
    setSavedEventIds(normalized.savedEventIds || []);
  };

  const loadEvents = useCallback(async () => {
    const response = await eventsApi.list();
    setEvents(response.data);
    return response.data;
  }, []);

  const loadRegistrations = useCallback(async () => {
    const response = await registrationsApi.list();
    setRegistrations(response.data);
    return response.data;
  }, []);

  // Restore session and load database records once on mount.
  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      setLoading(true);
      setApiError(null);

      try {
        await loadEvents();
      } catch (error) {
        if (!cancelled) setApiError(error.message);
      } finally {
        if (!cancelled) setLoading(false);
      }

      if (getToken()) {
        try {
          const response = await authApi.me();
          if (cancelled) return;
          hydrateUser(response.data.user);
          await loadRegistrations();
        } catch (_error) {
          // Expired or invalid token: fall back to a clean guest session.
          setToken(null);
          if (!cancelled) {
            setCurrentUser(null);
            setUserRole('guest');
            setSavedEventIds([]);
            setRegistrations([]);
          }
        }
      }
    };

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [loadEvents, loadRegistrations]);

  // Admin dashboard statistics are fetched from the backend, never hardcoded.
  useEffect(() => {
    if (userRole !== 'admin') {
      setStats(null);
      return undefined;
    }
    let cancelled = false;
    dashboardApi
      .stats()
      .then((response) => {
        if (!cancelled) setStats(response.data);
      })
      .catch(() => {
        if (!cancelled) setStats(null);
      });
    return () => {
      cancelled = true;
    };
  }, [userRole, events, registrations]);

  const refreshData = async () => {
    setApiError(null);
    try {
      await loadEvents();
      if (getToken()) await loadRegistrations();
      showToast('Data refreshed from the server.', 'success');
    } catch (error) {
      setApiError(error.message);
      showToast(error.message, 'error');
    }
  };

  // ---- Authentication -------------------------------------------------

  const loginUser = async (role = 'student', credentials = {}) => {
    try {
      const response = await authApi.login({
        email: credentials.email,
        password: credentials.password,
      });
      setToken(response.data.token, credentials.rememberMe !== false);
      hydrateUser(response.data.user);
      await loadRegistrations();
      const destination =
        response.data.user.role === 'admin' ? 'admin-dashboard' : 'student-dashboard';
      goToPage(destination);
      showToast(`Welcome back, ${response.data.user.name}!`, 'success');
      return true;
    } catch (error) {
      showToast(error.message, 'error');
      return false;
    }
  };

  const registerStudent = async (formData) => {
    try {
      const response = await authApi.register(formData);
      setToken(response.data.token);
      hydrateUser(response.data.user);
      setRegistrations([]);
      goToPage('student-dashboard');
      showToast(`Welcome to CampusConnect, ${response.data.user.name}!`, 'success');
      return true;
    } catch (error) {
      showToast(error.message, 'error');
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    setUserRole('guest');
    setSavedEventIds([]);
    setRegistrations([]);
    setStats(null);
    goToPage('landing');
    showToast('You have been logged out.', 'info');
  };

  const updateProfile = async (updatedData) => {
    try {
      const response = await usersApi.updateMe(updatedData);
      setCurrentUser({ ...response.data.user, avatar: response.data.user.avatar || DEFAULT_AVATAR });
      showToast('Profile information updated successfully!', 'success');
      return true;
    } catch (error) {
      showToast(error.message, 'error');
      return false;
    }
  };

  const changePassword = async (passwordData) => {
    try {
      await usersApi.changePassword(passwordData);
      showToast('Your password has been updated successfully!', 'success');
      return true;
    } catch (error) {
      showToast(error.message, 'error');
      return false;
    }
  };

  // ---- Events & registrations ----------------------------------------

  const searchEvents = async (params) => {
    const response = await eventsApi.list(params);
    return response.data;
  };

  const toggleSaveEvent = async (eventId) => {
    if (!currentUser) {
      goToPage('login');
      showToast('Please login to save events', 'info');
      return;
    }
    try {
      const wasSaved = savedEventIds.includes(eventId);
      const response = await usersApi.toggleSavedEvent(eventId);
      setSavedEventIds(response.data.savedEventIds);
      setCurrentUser((prev) =>
        prev ? { ...prev, savedEventIds: response.data.savedEventIds } : prev
      );
      showToast(
        wasSaved ? 'Event removed from saved items' : 'Event saved to your collection',
        wasSaved ? 'info' : 'success'
      );
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const registerForEvent = async (eventId) => {
    if (!currentUser) {
      goToPage('login');
      showToast('Please login to register for events', 'error');
      return false;
    }
    try {
      const response = await registrationsApi.create(eventId);
      const { registration, event } = response.data;
      setRegistrations((prev) => [
        registration,
        ...prev.filter((item) => item.id !== registration.id),
      ]);
      if (event) setEvents((prev) => prev.map((item) => (item.id === event.id ? event : item)));
      const title = events.find((item) => item.id === eventId)?.title || 'Event';
      showToast(`Successfully registered for "${title}"! 🎉`, 'success');
      return true;
    } catch (error) {
      showToast(error.message, 'error');
      return false;
    }
  };

  const cancelRegistration = async (registrationId) => {
    try {
      const response = await registrationsApi.remove(registrationId);
      const { registration, event } = response.data;
      setRegistrations((prev) => prev.map((item) => (item.id === registration.id ? registration : item)));
      if (event) setEvents((prev) => prev.map((item) => (item.id === event.id ? event : item)));
      showToast('Registration has been successfully cancelled.', 'info');
      return true;
    } catch (error) {
      showToast(error.message, 'error');
      return false;
    }
  };

  const saveEvent = async (eventData) => {
    try {
      if (eventData.id) {
        const response = await eventsApi.update(eventData.id, eventData);
        setEvents((prev) => prev.map((item) => (item.id === response.data.id ? response.data : item)));
        showToast(`Event "${response.data.title}" updated successfully!`, 'success');
      } else {
        const { id, registeredCount, ...rest } = eventData;
        const response = await eventsApi.create({
          ...rest,
          registeredCount: 0,
          agenda: rest.agenda && rest.agenda.length ? rest.agenda : DEFAULT_AGENDA,
        });
        setEvents((prev) => [response.data, ...prev]);
        showToast(`New event "${response.data.title}" published successfully!`, 'success');
      }
      return true;
    } catch (error) {
      showToast(error.message, 'error');
      return false;
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      await eventsApi.remove(eventId);
      setEvents((prev) => prev.filter((item) => item.id !== eventId));
      setRegistrations((prev) => prev.filter((item) => item.eventId !== eventId));
      showToast('Event has been deleted.', 'info');
      return true;
    } catch (error) {
      showToast(error.message, 'error');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        navigateTo,
        selectedEventId,
        setSelectedEventId,
        editingEventId,
        setEditingEventId,
        exploreCategory,
        setExploreCategory,
        currentUser,
        userRole,
        loginUser,
        registerStudent,
        logout,
        updateProfile,
        changePassword,
        events,
        registrations,
        savedEventIds,
        toggleSaveEvent,
        registerForEvent,
        cancelRegistration,
        saveEvent,
        deleteEvent,
        searchEvents,
        stats,
        loading,
        apiError,
        refreshData,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
