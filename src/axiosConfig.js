// src/axiosConfig.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://localhost:5002/api/v1', // Cambiado para que coincida con tu backend
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
