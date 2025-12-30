import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currency: localStorage.getItem('currency') || 'PKR',
  cartOpen: false,
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setCurrency: (state, action) => {
      state.currency = action.payload;
      localStorage.setItem('currency', action.payload);
    },
    toggleCart: (state) => {
      state.cartOpen = !state.cartOpen;
    },
    openCart: (state) => {
      state.cartOpen = true;
    },
  },
});

export const { setCurrency, toggleCart, openCart } = globalSlice.actions;
export const globalReducer = globalSlice.reducer;
