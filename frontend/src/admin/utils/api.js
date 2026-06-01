import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// AUTH API
// ============================================

export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  logout: () => api.post('/api/auth/logout'),
  verify: () => api.get('/api/auth/verify'),
};

// ============================================
// UPLOAD API
// ============================================

export const uploadAPI = {
  single: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  multiple: (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return api.post('/api/admin/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// ============================================
// CMS API
// ============================================

export const cmsAPI = {
  // Hero
  getHero: () => api.get('/api/admin/cms/hero'),
  updateHero: (data) => api.put('/api/admin/cms/hero', data),

  // Products
  getProducts: () => api.get('/api/admin/cms/products'),
  createProduct: (data) => api.post('/api/admin/cms/products', data),
  updateProduct: (id, data) => api.put(`/api/admin/cms/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/api/admin/cms/products/${id}`),

  // Gallery
  getGallery: (category) => api.get('/api/admin/cms/gallery', { params: { category } }),
  addImage: (data) => api.post('/api/admin/cms/gallery', data),
  updateImage: (id, data) => api.put(`/api/admin/cms/gallery/${id}`, data),
  deleteImage: (id) => api.delete(`/api/admin/cms/gallery/${id}`),

  // News
  getNews: (status) => api.get('/api/admin/cms/news', { params: { status } }),
  createNews: (data) => api.post('/api/admin/cms/news', data),
  updateNews: (id, data) => api.put(`/api/admin/cms/news/${id}`, data),
  deleteNews: (id) => api.delete(`/api/admin/cms/news/${id}`),

  // Careers
  getCareers: (status) => api.get('/api/admin/cms/careers', { params: { status } }),
  createCareer: (data) => api.post('/api/admin/cms/careers', data),
  updateCareer: (id, data) => api.put(`/api/admin/cms/careers/${id}`, data),
  deleteCareer: (id) => api.delete(`/api/admin/cms/careers/${id}`),

  // Team
  getTeam: () => api.get('/api/admin/cms/team'),
  createTeamMember: (data) => api.post('/api/admin/cms/team', data),
  updateTeamMember: (id, data) => api.put(`/api/admin/cms/team/${id}`, data),
  deleteTeamMember: (id) => api.delete(`/api/admin/cms/team/${id}`),

  // Investors
  getInvestors: () => api.get('/api/admin/cms/investors'),
  updateInvestors: (data) => api.put('/api/admin/cms/investors', data),
};

// ============================================
// CRM API
// ============================================

export const crmAPI = {
  // Enquiries
  getEnquiries: (params) => api.get('/api/admin/crm/enquiries', { params }),
  updateEnquiry: (id, data) => api.put(`/api/admin/crm/enquiries/${id}`, data),
  deleteEnquiry: (id) => api.delete(`/api/admin/crm/enquiries/${id}`),

  // Applications
  getApplications: (params) => api.get('/api/admin/crm/applications', { params }),
  updateApplication: (id, data) => api.put(`/api/admin/crm/applications/${id}`, data),
  deleteApplication: (id) => api.delete(`/api/admin/crm/applications/${id}`),
  downloadCV: (id) => `${API_BASE_URL}/api/admin/crm/applications/${id}/cv`,
};

export default api;

