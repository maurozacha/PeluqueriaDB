import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

async function apiGetEmpleados(token) {
  const res = await fetch(`${API_URL}/empleados/listar`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al obtener empleados');
  }

  return await res.json();
}

async function apiGetEmpleadoById(id, token) {
  const res = await fetch(`${API_URL}/empleados/${id}`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al obtener empleado');
  }

  return await res.json();
}

async function apiCreateEmpleado(empleadoData, token) {
  const res = await fetch(`${API_URL}/empleados/create`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(empleadoData)
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al crear empleado');
  }

  return await res.json();
}

export const fetchEmpleados = createAsyncThunk(
  'empleados/fetchEmpleados',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      
      if (!token) throw new Error('No hay token de autenticación');
      
      const response = await apiGetEmpleados(token);
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
      
      const response = await apiGetEmpleadoById(id, token);
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
      
      const response = await apiCreateEmpleado(empleadoData, token);
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
  createdEmpleado: null
};

const empleadoSlice = createSlice({
  name: 'empleados',
  initialState,
  reducers: {
    clearEmpleadoState(state) {
      state.error = null;
      state.success = null;
      state.createdEmpleado = null;
      state.empleadoActual = null;
    },
    resetEmpleados(state) {
      state.empleados = [];
      state.empleadoActual = null;
      state.loading = false;
      state.error = null;
      state.success = null;
      state.createdEmpleado = null;
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
        state.success = action.payload.message;
        state.error = null;
      })
      .addCase(createEmpleado.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      });
  }
});

export const { clearEmpleadoState, resetEmpleados } = empleadoSlice.actions;
export default empleadoSlice.reducer;