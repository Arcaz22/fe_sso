import axios from 'axios';
import keycloak from '../config/keycloak';

// const API_BASE_URL = 'http://localhost:8000';
const API_BASE_URL = 'https://bot.caa.biz.id/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    // ✅ Hanya attach token jika user sudah authenticated
    if (keycloak.authenticated && keycloak.token) {
      try {
        await keycloak.updateToken(30);
        config.headers.Authorization = `Bearer ${keycloak.token}`;
      } catch (error) {
        console.error('Failed to refresh token:', error);
        // ❌ JANGAN redirect di sini - biarkan error 401 ditangani di response interceptor
      }
    }
    // ✅ Jika belum authenticated, lanjutkan request tanpa token
    // Component yang akan handle redirect ke login jika perlu
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // ✅ Log error tapi JANGAN auto-redirect
    if (error.response?.status === 401) {
      console.error('❌ Unauthorized - Token invalid or expired');
      // Component akan handle ini dengan redirect manual
    }
    return Promise.reject(error);
  }
);

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

export default api;
