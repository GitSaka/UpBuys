import axios from 'axios';
import { getAuthToken} from './feedService';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Interceptor → ajoute le token automatiquement
api.interceptors.request.use((config) => {
  const token = getAuthToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;