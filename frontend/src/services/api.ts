import axios from 'axios';

/**
 * Axios instance for making API requests.
 */
const api = axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_URL}/api`,
  withCredentials: true
});

/**
 * Interceptor for adding the Authorization header to the request.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor for handling 401 Unauthorized responses when JWT expires or fails.
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      alert('You are not authenticated. Please login to continue.');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Interceptor for handling 429 Too Many Requests responses.
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 429) {
      localStorage.removeItem('token');
      alert('Too many requests. Please slow down!');
    }
    return Promise.reject(error);
  }
);

export default api;