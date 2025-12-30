import { GET, PUT, POST } from '@services/api';

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/shop/cart`;

export const cartAPI = {
  getCart: () => GET(`${BASE_URL}/`),
  updateCart: (cart) => PUT(`${BASE_URL}/`, { cart }),
  addToCart: (product_id, variant_id, quantity = 1) => 
    PUT(`${BASE_URL}/`, { product_id, variant_id, quantity }),
};
