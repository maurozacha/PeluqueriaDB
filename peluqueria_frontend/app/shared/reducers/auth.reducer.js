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

const verifyInitialToken = () => {
  const token = localStorage.getItem('authToken');
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch (error) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    return false;
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
      const token = localStorage.getItem('authToken');

      if (token) {
        const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGOUT}`;
        await apiCall(url, 'POST');
      }

      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');

      return { message: 'Sesión cerrada correctamente' };
    } catch (error) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      return rejectWithValue(error.message || 'Error al cerrar sesión');
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/check',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No hay token almacenado');
      }

      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`;
      const response = await apiCall(url, 'POST', { token });

      if (!response.token) {
        throw new Error('No se recibió nuevo token');
      }

      localStorage.setItem('authToken', response.token);

      return {
        token: response.token,
        message: 'Sesión renovada'
      };
    } catch (error) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      return rejectWithValue(error.message || 'Error al verificar autenticación');
    }
  }
);

export const listarUsuarios = createAsyncThunk(
  'auth/listarUsuarios',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.USUARIOS}`;

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener usuarios');
      }

      const data = await response.json();

      if (!data.usuarios) {
        throw new Error('No se recibió la lista de usuarios');
      }

      return {
        usuarios: data.usuarios,
        message: data.message || 'Lista de usuarios obtenida'
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Error al obtener usuarios');
    }
  }
);

export const actualizarRolUsuario = createAsyncThunk(
  'auth/actualizarRolUsuario',
  async ({ usuario, nuevoRol }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      console.log("user", usuario)
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.USUARIOS}/${usuario}/rol`;

      const response = await apiCall(url, 'PUT', { rol: nuevoRol }, {
        'Authorization': `Bearer ${token}`
      });

      return {
        usuario,
        nuevoRol,
        message: response.message || 'Rol actualizado exitosamente'
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Error al actualizar rol');
    }
  }
);

const initialState = {
  token: verifyInitialToken() ? localStorage.getItem('authToken') : null,
  user: verifyInitialToken() ? safeParse('userData') : null,
  loading: false,
  error: null,
  isAuthenticated: verifyInitialToken(),
  loginSuccess: false,
  registrationStatus: null,
  loginMessage: null,
  registerMessage: null,
  logoutMessage: null,
  checkingAuth: true,
  usuariosList: [],
  usuariosLoading: false,
  usuariosError: null,
  usuariosMessage: null
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
      state.user = action.payload;
      localStorage.setItem('userData', JSON.stringify(action.payload));
    },
    tokenExpired(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = 'Sesión expirada';
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.loginSuccess = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loginSuccess = true;
        state.loginMessage = action.payload.message;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.loginSuccess = false;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registrationStatus = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.registrationStatus = 'success';
        state.registerMessage = action.payload.message;

        if (action.payload.token) {
          state.token = action.payload.token;
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.registrationStatus = 'failed';
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        state.logoutMessage = 'Sesión cerrada correctamente';
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkAuth.pending, (state) => {
        state.checkingAuth = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.checkingAuth = false;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.checkingAuth = false;
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(listarUsuarios.pending, (state) => {
        state.usuariosLoading = true;
        state.usuariosError = null;
        state.usuariosMessage = null;
      })
      .addCase(listarUsuarios.fulfilled, (state, action) => {
        state.usuariosLoading = false;
        console.log("0",action.payload.usuarios)
        state.usuariosList = action.payload.usuarios;
        state.usuariosMessage = action.payload.message;
      })
      .addCase(listarUsuarios.rejected, (state, action) => {
        state.usuariosLoading = false;
        state.usuariosError = action.payload;
        state.usuariosList = [];
      })
      .addCase(actualizarRolUsuario.pending, (state) => {
        state.usuariosLoading = true;
        state.usuariosError = null;
      })
      .addCase(actualizarRolUsuario.fulfilled, (state, action) => {
        state.usuariosLoading = false;
        console.log("1=",action.payload.usuario);
        state.usuariosList = state.usuariosList.map(usuario =>
          usuario.usuario === action.payload.usuario
            ? { ...usuario, rol: action.payload.nuevoRol }
            : usuario
        );
      })
      .addCase(actualizarRolUsuario.rejected, (state, action) => {
        state.usuariosLoading = false;
        state.usuariosError = action.payload;
      });
  }
});

export const { clearAuthState, setUserData, tokenExpired } = authSlice.actions;
export default authSlice.reducer;