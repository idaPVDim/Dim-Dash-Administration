import axios from 'axios';

// URL de base API Django (adapter selon votre config)
//const API_URL = 'http://127.0.0.1:8000';
const API_URL = 'https://api.dimfaso.com';
// Création instance Axios
const api = axios.create({
  baseURL: API_URL,
});

// Ajout automatique du token dans les headers si présent dans localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Token ${token}`; // Toujours « Token » avec T majuscule + espace
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
