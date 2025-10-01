
import axios from 'axios';
import { store } from '../redux/store';
import { setEmployeeCredentials, logoutEmployee } from '../redux/slices/authSlice';

const API_URL = import.meta.env.VITE_NODEJS_API_URL || 'http://localhost:9999/api';
const employeeApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

employeeApi.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state?.auth?.employee?.token;
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

employeeApi.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await employeeApi.post('/emps/refreshToken'); 
        const newAccessToken = res.data.accessToken;
        store.dispatch(setEmployeeCredentials({
          token: newAccessToken, 
          employee: store.getState().auth.employee,
        }));
        originalRequest.headers['Authorization'] = `Bearer ${res.data.token}`;
        return employeeApi(originalRequest);
        
      } catch (e) {
        store.dispatch(logoutEmployee());
        return Promise.reject(e);
      }
    }
    return Promise.reject(err);
  }
);

export default employeeApi;
