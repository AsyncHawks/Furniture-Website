import { GET } from '@services/api';

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/shop/products`;

export const productAPI = {
  fetchAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return GET(`${BASE_URL}/?${query}`);
  },

  fetchByCategory: (category, page = 1, pageSize = 12, filters = {}) => {
    const params = {
      category,
      page,
      page_size: pageSize,
    };

    // Add optional filters
    if (filters.available) {
      params.available = filters.available ? 'in' : '';
    }
    if (filters.price_min) {
      params.price_min = filters.price_min;
    }
    if (filters.price_max) {
      params.price_max = filters.price_max;
    }
    if (filters.sort) {
      params.sort = filters.sort;
    }

    const query = new URLSearchParams(params).toString();
    const url = `${BASE_URL}/?${query}`;

    return GET(url);
  },

  fetchById: (id) => {
    return GET(`${BASE_URL}/${id}/`);
  },
};
