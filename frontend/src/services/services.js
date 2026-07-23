import api from './api';
export const workoutService = {
  getAll: (params) => api.get('/workouts', { params }),
  getById: (id) => api.get(`/workouts/${id}`),
  create: (data) => api.post('/workouts', data),
  update: (id, data) => api.put(`/workouts/${id}`, data),
  delete: (id) => api.delete(`/workouts/${id}`),
};

export const dietService = {
  getAll: (params) => api.get('/diets', { params }),
  getById: (id) => api.get(`/diets/${id}`),
  create: (data) => api.post('/diets', data),
  update: (id, data) => api.put(`/diets/${id}`, data),
  delete: (id) => api.delete(`/diets/${id}`),
};

export const membershipService = {
  getAll: () => api.get('/memberships'),
  getById: (id) => api.get(`/memberships/${id}`),
  purchase: (id) => api.post(`/memberships/${id}/purchase`),
  create: (data) => api.post('/memberships', data),
  update: (id, data) => api.put(`/memberships/${id}`, data),
  delete: (id) => api.delete(`/memberships/${id}`),
};

export const trainerService = {
  getAll: (params) => api.get('/trainers', { params }),
  getById: (id) => api.get(`/trainers/${id}`),
  bookSession: (data) => api.post('/trainers/bookings', data),
  getMyBookings: () => api.get('/trainers/bookings/my'),
  create: (data) => api.post('/trainers', data),
  update: (id, data) => api.put(`/trainers/${id}`, data),
  delete: (id) => api.delete(`/trainers/${id}`),
};

export const progressService = {
  getAll: () => api.get('/progress'),
  add: (data) => api.post('/progress', data),
  update: (id, data) => api.put(`/progress/${id}`, data),
  delete: (id) => api.delete(`/progress/${id}`),
};

export const userService = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
  delete: (id) => api.delete(`/users/${id}`),
};

export const adminService = {
  getAnalytics: () => api.get('/admin/analytics'),
  getContacts: () => api.get('/admin/contacts'),
  submitContact: (data) => api.post('/admin/contacts', data),
  updateContact: (id, status) => api.put(`/admin/contacts/${id}`, { status }),
  getBlogs: () => api.get('/admin/blogs'),
  createBlog: (data) => api.post('/admin/blogs', data),
  updateBlog: (id, data) => api.put(`/admin/blogs/${id}`, data),
  deleteBlog: (id) => api.delete(`/admin/blogs/${id}`),
};

export const aiService = {
  generateWorkout: (data) => api.post('/ai/generate-workout', data),
  generateDiet: (data) => api.post('/ai/generate-diet', data),
  chat: (data) => api.post('/ai/chat', data),
};

export const dashboardService = {
  getSummary: () => api.get('/dashboard'),
};

export const exerciseService = {
  getAll: (category) => api.get('/exercises', { params: { category } }),
};

export const contactService = {
  submit: (data) => api.post('/contact', data),
};
