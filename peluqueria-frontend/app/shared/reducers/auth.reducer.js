
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

async function apiLogin(username, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) throw new Error('Credenciales inválidas');

  const data = await res.json();
  localStorage.setItem('token', data.token);
  return data.token;
}

function apiLogout() {
  localStorage.removeItem('token');
}

function getToken() {
  return localStorage.getItem('token');
}

function isAuthenticated() {
  return !!getToken();
}

// --- Thunks ---
export const login = createAsyncThunk(
  'authentication/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const token = await apiLogin(username, password);
      return token;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// --- Slice ---
const initialState = {
  isAuthenticated: isAuthenticated(),
  token: getToken() || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    logout: (state) => {
      apiLogout();
      state.isAuthenticated = false;
      state.token = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
