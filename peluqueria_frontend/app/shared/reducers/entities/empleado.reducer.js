import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_CONFIG, apiCall } from '../../config/api';

export const fetchEmpleados = createAsyncThunk(
  'empleados/fetchEmpleados',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      if (!token) throw new Error('No hay token de autenticación');
      
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.EMPLEADOS.GET_ALL}`;
      const response = await apiCall(url, 'GET');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchEmpleadoById = createAsyncThunk(
  'empleados/fetchEmpleadoById',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      if (!token) throw new Error('No hay token de autenticación');
      
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.EMPLEADOS.GET_BY_ID.replace(':empleado_id', id)}`;
      const response = await apiCall(url, 'GET');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createEmpleado = createAsyncThunk(
  'empleados/createEmpleado',
  async (empleadoData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      if (!token) throw new Error('No hay token de autenticación');
      
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.EMPLEADOS.CREATE}`;
      const response = await apiCall(url, 'POST', empleadoData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateEmpleado = createAsyncThunk(
  'empleados/updateEmpleado',
  async ({ empleadoId, empleadoData }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      if (!token) throw new Error('No hay token de autenticación');
      
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.EMPLEADOS.UPDATE}`;
      const response = await apiCall(url, 'PUT', { id: empleadoId, ...empleadoData });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  empleados: [],
  empleadoActual: null,
  loading: false,
  error: null,
  success: null,
  createdEmpleado: null,
  updatedEmpleado: null
};

const empleadoSlice = createSlice({
  name: 'empleados',
  initialState,
  reducers: {
    clearEmpleadoState(state) {
      state.error = null;
      state.success = null;
      state.createdEmpleado = null;
      state.updatedEmpleado = null;
      state.empleadoActual = null;
    },
    resetEmpleados(state) {
      state.empleados = [];
      state.empleadoActual = null;
      state.loading = false;
      state.error = null;
      state.success = null;
      state.createdEmpleado = null;
      state.updatedEmpleado = null;
    },
    setEmpleadoActual(state, action) {
      state.empleadoActual = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmpleados.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmpleados.fulfilled, (state, action) => {
        state.loading = false;
        state.empleados = action.payload;
        state.error = null;
      })
      .addCase(fetchEmpleados.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEmpleadoById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.empleadoActual = null;
      })
      .addCase(fetchEmpleadoById.fulfilled, (state, action) => {
        state.loading = false;
        state.empleadoActual = action.payload;
        state.error = null;
      })
      .addCase(fetchEmpleadoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createEmpleado.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createEmpleado.fulfilled, (state, action) => {
        state.loading = false;
        state.empleados = [...state.empleados, action.payload];
        state.createdEmpleado = action.payload;
        state.success = 'Empleado creado exitosamente';
        state.error = null;
      })
      .addCase(createEmpleado.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      })
      .addCase(updateEmpleado.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateEmpleado.fulfilled, (state, action) => {
        state.loading = false;
        state.empleados = state.empleados.map(empleado => 
          empleado.id === action.payload.id ? action.payload : empleado
        );

        if (state.empleadoActual && state.empleadoActual.id === action.payload.id) {
          state.empleadoActual = action.payload;
        }
        state.updatedEmpleado = action.payload;
        state.success = 'Empleado actualizado exitosamente';
        state.error = null;
      })
      .addCase(updateEmpleado.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      });
  }
});

export const { 
  clearEmpleadoState, 
  resetEmpleados, 
  setEmpleadoActual 
} = empleadoSlice.actions;

export default empleadoSlice.reducer;