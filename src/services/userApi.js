import axios from 'axios';

// URL de base de l'API utilisateur (à adapter selon backend)
const API_URL = 'http://127.0.0.1:8000/user/api';

// Instance axios configurée (auth token injecté automatiquement)
const api = axios.create({
  baseURL: API_URL,
});

// Intercepteur pour injecter le token dans les headers Authorization
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  error => Promise.reject(error)
);


/**
 * AUTHENTIFICATION
 */

// Connexion (login) - pas besoin de token
export const login = (credentials) => {
  return axios.post(`${API_URL}/login/`, credentials);
};

// Inscription (register) - pas besoin de token
export const register = (userData) => {
  return axios.post(`${API_URL}/register/`, userData);
};

// Déconnexion (logout) - nécessite token
export const logout = () => {
  return api.post('/logout/', null);
};


/**
 * GESTION PROFIL UTILISATEUR
 */

// Récupérer le profil connecté (user me)
export const getMyProfile = () => api.get('/users/me/');

// Mettre à jour partiellement le profil connecté (PATCH)
export const updateMyProfile = (data) => api.patch('/users/me/', data);

// Récupérer profil d’un utilisateur par ID (admin)
export const getUserById = (id) => api.get(`/users/${id}/`);

// Mise à jour complète utilisateur (PUT)
export const updateUser = (id, data) => api.put(`/users/${id}/`, data);

// Suppression utilisateur
export const deleteUser = (id) => api.delete(`/users/${id}/`);

// Création utilisateur (ex: admin crée un user)
export async function createUser(userData) {
  return api.post('/users/', userData);
}

// Création profil client lié à un utilisateur
export async function createClientProfile(userId, profileData) {
  return api.post('/profil-clients/', { user: userId, ...profileData });
}

// Récupérer profil client lié à un user
export const getClientProfile = (userId) =>
  api.get(`/profil-clients/?user=${userId}`).then(res =>
    res.data.length ? { data: res.data[0] } : { data: null }
  );

// Mise à jour profil client partielle
export const updateClientProfile = (profileId, data) =>
  api.patch(`/profil-clients/${profileId}/`, data);

// Création profil technicien lié à un utilisateur (formData pour photo/fichier)
export async function createTechnicienProfile(userId, formData, config) {
  formData.append('user', userId);
  return api.post('/profil-techniciens/', formData, config);
}

// Récupérer profil technicien lié à un user
export const getTechnicienProfile = (userId) =>
  api.get(`/profil-techniciens/?user=${userId}`).then(res =>
    res.data.length ? { data: res.data[0] } : { data: null }
  );
export const getProfile = () => {
  return api.get('/profile/');
};

// Mise à jour profil technicien partielle
export const updateTechnicienProfile = (profileId, data) =>
  api.patch(`/profil-techniciens/${profileId}/`, data);

// Changer le mot de passe utilisateur (par admin)
export const updateUserPassword = (userId, data) =>
  api.put(`/users/${userId}/change_password/`, data);

// Changer mot de passe connecté (si API supporte endpoint spécifique)
export const changeMyPassword = (data) => api.post('/users/me/change_password/', data);

export const updateProfile = (data) => api.put('/profile/', data);

// GET paramètres utilisateur
export const getSettings = () => {
  return api.get('/settings/'); // ou l’endpoint réel de votre backend
};

// PUT ou PATCH pour mettre à jour les settings
export const updateSettings = (data) => {
  return api.put('/settings/', data);
};
/**
 * GESTION LISTE UTILISATEURS
 */

// Obtenir liste paginée d’utilisateurs
export const getUsers = (page = 1, pageSize = 10, search = '') =>
  api.get('/users/', {
    params: { page, page_size: pageSize, search },
  });

/**
 * GESTION AUTRE(S) ENDPOINTS/ENTITÉS constament liés aux users
 */

// Exemple: récupérer les rôles disponibles (si existe)
export const getRoles = () => api.get('/roles/');

// Exemple: endpoints pour permissions si vous gérez
export const getPermissions = () => api.get('/permissions/');

export default api;
