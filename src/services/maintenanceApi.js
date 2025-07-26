// src/services/maintenanceApi.js
import api from './api';

export const getInterventions = () => api.get('/maintenance/api/interventions/');
export const getIncidents = () => api.get('/maintenance/api/incidents/');
export const getQuestionsMaintenance = () => api.get('/maintenance/api/questions-maintenance/');

// Ajoutez création/modification suppression si nécessaire
