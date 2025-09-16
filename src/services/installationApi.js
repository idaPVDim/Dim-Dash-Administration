import api from './api';  // l'instance axios configurée avec baseURL et interceptor

// Les endpoints de l'API Installation
export const getInstallations = () => {
  return api.get('/installation/installations/');
};

export const getInstallationById = (id) => {
  return api.get(`/installation/installations/${id}/`);
};

export const createInstallation = (data) => {
  return api.post('/installation/installations/', data);
};

export const updateInstallation = (id, data) => {
  return api.put(`/installation/installations/${id}/`, data);
};

export const deleteInstallation = (id) => {
  return api.delete(`/installation/installations/${id}/`);
};
