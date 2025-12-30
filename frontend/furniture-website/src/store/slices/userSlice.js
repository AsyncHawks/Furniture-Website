import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '@services';

export const loginThunk = createAsyncThunk(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await authAPI.login(credentials);
      return res;
    } catch (err) {
      return rejectWithValue(err.message || 'Login failed');
    }
  }
);

export const logoutThunk = createAsyncThunk('user/logout', async (_, { rejectWithValue }) => {
  try {
    await authAPI.logout();
    return true;
  } catch (err) {
    return rejectWithValue(err.message || 'Logout failed');
  }
});

export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await authAPI.getCurrentUser();
      return res;
    } catch (err) {
      return rejectWithValue(err.message || 'Fetch current user failed');
    }
  }
);

const initialState = {
  userInfo: null,
  isLoggedIn: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserInfo(state) {
      state.userInfo = null;
      state.isLoggedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload.user;
        state.isLoggedIn = true;
        // Store tokens in localStorage
        if (action.payload.tokens) {
          localStorage.setItem('accessToken', action.payload.tokens.access);
          localStorage.setItem('refreshToken', action.payload.tokens.refresh);
        }
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.userInfo = action.payload.user;
        state.isLoggedIn = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.userInfo = null;
        state.isLoggedIn = false;
        state.error = action.payload || 'Failed to load user';
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.userInfo = null;
        state.isLoggedIn = false;
        // Clear tokens from localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        state.isLoggedIn = false;
      });
  },
});

export const { clearUserInfo } = userSlice.actions;
export const userReducer = userSlice.reducer;
