import axios from 'axios';

// Base URL API
const API_BASE_URL = 'http://127.0.0.1:8000/product/api';

// Récupération du token dans localStorage (ou tout autre stockage)
const token = localStorage.getItem('authToken');

// Création d’une instance axios avec header Authorization si token présent
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: token ? { Authorization: `Token ${token}` } : {},
  // Si vous utilisez cookies/session, ajoutez aussi withCredentials: true
  // withCredentials: true,
});

// --- CATEGORIES ---

export function getCategories(page = 1, pageSize = 10, search = '', ordering = '') {
  const params = { page, page_size: pageSize };
  if (search) params.search = search;
  if (ordering) params.ordering = ordering;

  return axiosInstance.get('/categories/', { params });
}

export function getCategorieById(id) {
  return axiosInstance.get(`/categories/${id}/`);
}

export function createCategorie(data) {
  return axiosInstance.post('/categories/', data);
}

export function updateCategorie(id, data) {
  return axiosInstance.put(`/categories/${id}/`, data);
}

export function deleteCategorie(id) {
  return axiosInstance.delete(`/categories/${id}/`);
}

// --- MARQUES ---

export function getMarques(page = 1, pageSize = 10, search = '', ordering = '') {
  const params = { page, page_size: pageSize };
  if (search) params.search = search;
  if (ordering) params.ordering = ordering;

  return axiosInstance.get('/marques/', { params });
}

export function getMarqueById(id) {
  return axiosInstance.get(`/marques/${id}/`);
}

export function createMarque(data) {
  return axiosInstance.post('/marques/', data);
}

export function updateMarque(id, data) {
  return axiosInstance.put(`/marques/${id}/`, data);
}

export function deleteMarque(id) {
  return axiosInstance.delete(`/marques/${id}/`);
}

// --- EQUIPEMENTS ---

export function getEquipements(page = 1, pageSize = 10, search = '', ordering = '') {
  const params = { page, page_size: pageSize };
  if (search) params.search = search;
  if (ordering) params.ordering = ordering;

  return axiosInstance.get('/equipements/', { params });
}

export function getEquipementById(id) {
  return axiosInstance.get(`/equipements/${id}/`);
}

export function createEquipement(data) {
  return axiosInstance.post('/equipements/', data);
}

export function updateEquipement(id, data) {
  return axiosInstance.put(`/equipements/${id}/`, data);
}

export function deleteEquipement(id) {
  return axiosInstance.delete(`/equipements/${id}/`);
}


