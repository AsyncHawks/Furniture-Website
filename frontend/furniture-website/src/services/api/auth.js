import { GET, POST } from '@services/api';

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/auth`;

export const authAPI = {
  signup: (data) => POST(`${BASE_URL}/signup/`, data),
  sendVerifyEmail: (email) => POST(`${BASE_URL}/send-verify-email/`, { email }),
  login: (data) => POST(`${BASE_URL}/login/`, data),
  logout: () => POST(`${BASE_URL}/logout/`),
  getCurrentUser: () => GET(`${BASE_URL}/me/`),
  requestPasswordSet: (email) => POST(`${BASE_URL}/request-password-set/`, { email }),
  resetPassword: (data) => POST(`${BASE_URL}/reset-password/`, data),
};
