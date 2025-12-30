import { GET } from '@services/api';
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/shop/categories`;
export const collectionsAPI = {
  fetchAll: () => GET(`${BASE_URL}/`),
};
