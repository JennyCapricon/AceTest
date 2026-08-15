import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

export const examAPI = {
  create: (data) => api.post('/exams', data),
  getAll: (params) => api.get('/exams', { params }),
  getOne: (id) => api.get(`/exams/${id}`),
  update: (id, data) => api.put(`/exams/${id}`, data),
  delete: (id) => api.delete(`/exams/${id}`),
  publish: (id) => api.put(`/exams/${id}/publish`),
  schedule: (id, data) => api.put(`/exams/${id}/schedule`, data),
  addQuestions: (id, data) => api.post(`/exams/${id}/questions`, data),
  getAvailable: () => api.get('/exams/available'),
  getUpcoming: () => api.get('/exams/upcoming'),
  start: (id) => api.post(`/exams/${id}/start`),
  submit: (id, data) => api.post(`/exams/${id}/submit`, data),
};

export const questionAPI = {
  create: (data) => api.post('/questions', data),
  getAll: (params) => api.get('/questions', { params }),
  getOne: (id) => api.get(`/questions/${id}`),
  update: (id, data) => api.put(`/questions/${id}`, data),
  delete: (id) => api.delete(`/questions/${id}`),
  import: (formData) => api.post('/questions/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export const resultAPI = {
  getAll: (params) => api.get('/results', { params }),
  getOne: (id) => api.get(`/results/${id}`),
  exportResults: (examId, format) => api.get(`/results/${examId}/export`, { params: { format } }),
  getStudentDashboard: () => api.get('/results/student/dashboard'),
  getTeacherDashboard: () => api.get('/results/teacher/dashboard'),
  getAdminDashboard: () => api.get('/results/admin/dashboard'),
};

export const adminAPI = {
  getUsers: (params) => api.get('/admin/users', { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  toggleStatus: (id) => api.put(`/admin/users/${id}/toggle-status`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getSchools: () => api.get('/admin/schools'),
  createSchool: (data) => api.post('/admin/schools', data),
  updateSchool: (id, data) => api.put(`/admin/schools/${id}`, data),
  deleteSchool: (id) => api.delete(`/admin/schools/${id}`),
  getStats: () => api.get('/admin/stats'),
};

export const subjectAPI = {
  getAll: () => api.get('/subjects'),
  create: (data) => api.post('/subjects', data),
  update: (id, data) => api.put(`/subjects/${id}`, data),
  delete: (id) => api.delete(`/subjects/${id}`),
};

export const auditAPI = {
  getAll: (params) => api.get('/audit-logs', { params }),
  getMine: (params) => api.get('/audit-logs/me', { params }),
};

export const gamificationAPI = {
  getLeaderboard: (params) => api.get('/gamification/leaderboard', { params }),
  getMine: () => api.get('/gamification/me'),
  getBadges: () => api.get('/gamification/badges'),
};

export const certificateAPI = {
  generate: (data) => api.post('/certificates', data),
  getMine: () => api.get('/certificates/mine'),
  getOne: (id) => api.get(`/certificates/${id}`),
};

export const notificationAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

export const announcementAPI = {
  create: (data) => api.post('/announcements', data),
  getAll: () => api.get('/announcements'),
  delete: (id) => api.delete(`/announcements/${id}`),
};

export default api;
