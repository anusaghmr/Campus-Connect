import api from './api';

const unwrap = (response) => response.data;

/** API groups used by AppContext. Components never call these directly. */
export const authApi = {
  register: (payload) => api.post('/auth/register', payload).then(unwrap),
  login: (payload) => api.post('/auth/login', payload).then(unwrap),
  me: () => api.get('/auth/me').then(unwrap),
};

export const eventsApi = {
  list: (params) => api.get('/events', { params }).then(unwrap),
  getById: (id) => api.get(`/events/${id}`).then(unwrap),
  create: (payload) => api.post('/events', payload).then(unwrap),
  update: (id, payload) => api.put(`/events/${id}`, payload).then(unwrap),
  remove: (id) => api.delete(`/events/${id}`).then(unwrap),
};

export const registrationsApi = {
  list: (params) => api.get('/registrations', { params }).then(unwrap),
  create: (eventId) => api.post('/registrations', { eventId }).then(unwrap),
  remove: (id) => api.delete(`/registrations/${id}`).then(unwrap),
};

export const usersApi = {
  updateMe: (payload) => api.put('/users/me', payload).then(unwrap),
  changePassword: (payload) => api.put('/users/me/password', payload).then(unwrap),
  toggleSavedEvent: (eventId) =>
    api.put(`/users/me/saved-events/${eventId}`).then(unwrap),
};

export const dashboardApi = {
  stats: () => api.get('/dashboard/stats').then(unwrap),
};
