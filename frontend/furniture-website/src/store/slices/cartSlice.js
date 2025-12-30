import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { cartAPI } from '@services';

export const fetchRemoteCart = createAsyncThunk(
  'cart/fetchRemote',
  async (_, { rejectWithValue }) => {
    try {
      const res = await cartAPI.getCart();
      // Convert backend cart format to frontend format
      const cart = res || {};
      const cartStore = {};
      
      if (cart.items && Array.isArray(cart.items)) {
        cart.items.forEach(item => {
          const id = item.variant?.id || item.product?.id;
          if (id) {
            cartStore[id] = {
              productId: item.product?.id,
              variantId: item.variant?.id || null,
              title: item.product?.title,
              variantTitle: item.variant?.title || null,
              price: item.variant?.price || item.product?.price,
              image: item.variant?.image || item.product?.image,
              quantity: item.quantity,
            };
          }
        });
      }
      
      return cartStore;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const syncCartToRemote = createAsyncThunk(
  'cart/syncRemote',
  async (cartItem, { rejectWithValue }) => {
    try {
      // cartItem should contain: { productId, variantId, quantity }
      const product_id = cartItem.productId || cartItem.id;
      const variant_id = cartItem.variantId || null;
      const quantity = cartItem.quantity || 1;
      
      const response = await cartAPI.addToCart(product_id, variant_id, quantity);
      return response.cart || {};
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  store: {},
  totalItems: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      if (typeof action.payload !== 'object' || Array.isArray(action.payload)) return;
      state.store = action.payload;
      state.totalItems = Object.keys(action.payload).length;
    },
    addToCart: (state, action) => {
      const item = action.payload;
      const id = item.variantId || item.productId;
      const qty = item.quantity ?? 1;

      if (state.store[id]) {
        state.store[id].quantity += qty;
      } else {
        state.store[id] = { ...item, quantity: qty };
        state.totalItems += 1;
      }
    },
    removeFromCart: (state, action) => {
      const id = action.payload.id;
      if (state.store[id]) {
        delete state.store[id];
        state.totalItems -= 1;
      }
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      if (!state.store[id]) return;
      if (quantity < 1) return;

      state.store[id].quantity = quantity;
    },
    clearCart: (state) => {
      state.store = {};
      state.totalItems = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRemoteCart.fulfilled, (state, action) => {
        // Replace local cart with backend cart
        state.store = action.payload;
        state.totalItems = Object.keys(action.payload).length;
      })
      .addCase(syncCartToRemote.fulfilled, (state, action) => {
        // Optionally sync server cart back to local state
        // This ensures consistency between local and remote
      });
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCart } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
