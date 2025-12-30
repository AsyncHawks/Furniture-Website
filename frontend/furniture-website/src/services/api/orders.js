import { GET, POST } from '@services/api';

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/shop`;

export const ordersAPI = {
  placeOrder: (orderData) => POST(`${BASE_URL}/orders/`, orderData),
  trackOrderById: (id) => {
    return GET(`${BASE_URL}/track-order/${id}/`);
  },
};
