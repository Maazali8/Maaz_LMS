import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

export const courseAPI = {
  getAll: (params) => API.get('/courses', { params }),
  getOne: (id) => API.get(`/courses/${id}`),
  create: (data) => API.post('/courses', data),
  update: (id, data) => API.put(`/courses/${id}`, data),
  delete: (id) => API.delete(`/courses/${id}`),
  addLesson: (id, data) => API.post(`/courses/${id}/lessons`, data),
  getMyCourses: () => API.get('/courses/my-courses'),
};

export const userAPI = {
  getAll: () => API.get('/users'),
  delete: (id) => API.delete(`/users/${id}`),
  getAnalytics: () => API.get('/users/analytics'),
};

export const enrollmentAPI = {
  enroll: (courseId) => API.post('/enrollments', { courseId }),
  getMyCourses: () => API.get('/enrollments/my-courses'),
  updateProgress: (id, lessonId) => API.put(`/enrollments/${id}/progress`, { lessonId }),
};

export default API;
