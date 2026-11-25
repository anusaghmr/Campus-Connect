import axios from 'axios';

const TOKEN_KEY = 'cc_token';

/** Central Axios instance. Every backend request goes through this client. */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

export const getToken = () =>
  localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);

/**
 * `remember = true` keeps the session across browser restarts; otherwise the
 * token lives in sessionStorage and disappears when the tab is closed.
 */
export const setToken = (token, remember = true) => {
  if (!token) {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    return;
  }
  if (remember) {
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.setItem(TOKEN_KEY, token);
  }
};

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message;
    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.code === 'ECONNABORTED') {
      message = 'The server took too long to respond. Please try again.';
    } else if (error.request) {
      message = 'Cannot reach the server. Please make sure the backend is running.';
    } else {
      message = 'Something went wrong. Please try again.';
    }

    const apiError = new Error(message);
    apiError.status = error.response?.status || 0;
    apiError.errors = error.response?.data?.errors || [];
    return Promise.reject(apiError);
  }
);

export default api;
