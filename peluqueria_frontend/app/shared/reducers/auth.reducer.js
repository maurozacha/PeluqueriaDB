import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API_CONFIG, apiCall } from '../config/api';

const safeParse = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage:`, error);
    localStorage.removeItem(key);
    return null;
  }
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`;
      const response = await apiCall(url, 'POST', credentials);
      
      if (!response.token) {
        throw new Error('No se recibió token en la respuesta');
      }
      
      const userData = response.user || { 
        nombre: 'Usuario',
        email: response.email || 'No especificado'
      };
      
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      return {
        token: response.token,
        user: userData,
        userData: userData,
        message: response.message || 'Inicio de sesión exitoso'
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Error al iniciar sesión');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REGISTER}`;
      const response = await apiCall(url, 'POST', userData);
      
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userData', JSON.stringify(response.user));
      }
      
      return {
        token: response.token,
        user: response.user,
        userData: response.user,
        message: response.message || 'Registro exitoso'
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Error al registrar usuario');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGOUT}`;
      await apiCall(url, 'POST', null, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      
      return {
        message: 'Sesión cerrada correctamente'
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Error al cerrar sesión');
    }
  }
);

const initialState = {
  token: localStorage.getItem('authToken') || null,
  user: safeParse('userData'),
  userData: safeParse('userData'),
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('authToken'),
  loginSuccess: false,
  registrationStatus: null,
  loginMessage: null,
  registerMessage: null,
  logoutMessage: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthState(state) {
      state.error = null;
      state.loginSuccess = false;
      state.registrationStatus = null;
      state.loginMessage = null;
      state.registerMessage = null;
      state.logoutMessage = null;
    },
    setUserData(state, action) {
      state.userData = action.payload;
      localStorage.setItem('userData', JSON.stringify(action.payload));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.loginSuccess = false;
        state.loginMessage = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.userData = action.payload.userData;
        state.isAuthenticated = true;
        state.loginSuccess = true;
        state.loginMessage = action.payload.message;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.loginSuccess = false;
        state.loginMessage = null;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registrationStatus = null;
        state.registerMessage = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.registrationStatus = 'success';
        state.registerMessage = action.payload.message;
        
        if (action.payload.token) {
          state.token = action.payload.token;
          state.user = action.payload.user;
          state.userData = action.payload.userData;
          state.isAuthenticated = true;
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.registrationStatus = 'failed';
        state.registerMessage = null;
      })
      
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.logoutMessage = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.loading = false;
        state.token = null;
        state.user = null;
        state.userData = null;
        state.isAuthenticated = false;
        state.logoutMessage = action.payload.message;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.logoutMessage = null;
      });
  }
});

export const { clearAuthState, setUserData } = authSlice.actions;
export default authSlice.reducer;