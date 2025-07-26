import axios from 'axios';

// URL de base API Django (adapter selon votre config)
const API_URL = 'http://127.0.0.1:8000';
//http://127.0.0.1:8000/user/api/logout/
// Création instance Axios
const api = axios.create({
  baseURL: API_URL,
});

// Ajout automatique du token dans les headers si présent dans localStorage
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
}, error => Promise.reject(error));
