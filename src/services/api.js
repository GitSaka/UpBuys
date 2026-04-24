import axios from 'axios';
import { getAuthToken} from './feedService';

// const api = axios.create({
//   baseURL: import.meta.LOCAL_API_URL,
// });

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
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