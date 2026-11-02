import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Server ka origin (http://localhost:5000), uploaded images isi se aati hain
export const SERVER_URL = API_URL.replace(/\/api\/?$/, '');

// '/uploads/abc.png' -> 'http://localhost:5000/uploads/abc.png'; full URL ho to waisa hi
export const imageSrc = (path) => {
  if (!path) return '';
  return path.startsWith('http') ? path : `${SERVER_URL}${path}`;
};

export default api;
