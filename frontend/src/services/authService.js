import api from './api';
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (email, password) => api.post('/auth/login', { email, password }),
  googleLogin: (userData) => api.post('/auth/google', userData),
  getProfile: () => api.get('/auth/profile'),
};
