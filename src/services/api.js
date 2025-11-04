import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data)
};

export const plantationAPI = {
  add: (formData) => api.post('/plantations', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAll: (userId) => api.get('/plantations', { params: { user_id: userId } }),
  verify: (id, verified) => api.post(`/plantations/${id}/verify`, { verified })
};

export const grievanceAPI = {
  create: (formData) => api.post('/grievances', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAll: (params) => api.get('/grievances', { params }),
  update: (id, data) => api.patch(`/grievances/${id}`, data)
};

export const pollutionAPI = {
  add: (data) => api.post('/pollution', data),
  get: (wardId) => api.get('/pollution', { params: { ward_id: wardId } })
};

export const revenueAPI = {
  getAll: () => api.get('/revenue')
};

export default api;
