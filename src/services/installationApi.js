import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/user/api';  // base URL de votre backend API (ajustez si besoin)

export const getInstallations = (token) => {
  return axios.get(`${API_URL}/installations/`, {
    headers: { Authorization: `Token ${token}` }
  });
};

export const getInstallationById = (token, id) => {
  return axios.get(`${API_URL}/installations/${id}/`, {
    headers: { Authorization: `Token ${token}` }
  });
};

export const createInstallation = (token, data) => {
  return axios.post(`${API_URL}/installations/`, data, {
    headers: { Authorization: `Token ${token}` }
  });
};

export const updateInstallation = (token, id, data) => {
  return axios.put(`${API_URL}/installations/${id}/`, data, {
    headers: { Authorization: `Token ${token}` }
  });
};

export const deleteInstallation = (token, id) => {
  return axios.delete(`${API_URL}/installations/${id}/`, {
    headers: { Authorization: `Token ${token}` }
  });
};
