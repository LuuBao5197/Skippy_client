import axios from 'axios';
import { store } from '../redux/store';
const API_URL = import.meta.env.VITE_NODEJS_API_URL || 'http://localhost:9999/api';
const ownerApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

ownerApi.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state?.auth?.owner?.accessToken; // Lấy token của owner
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
ownerApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      window.location.href = '/ETMTool/owner/login';
    }
    return Promise.reject(err);
  }
);

export default ownerApi;