import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_CONFIG } from '../config/api';

async function apiGetClientes(token) {
  const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CLIENTES.GET_ALL}`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al obtener clientes');
  }

  return await res.json();
}

async function apiCreateCliente(clienteData, token) {
  const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CLIENTES.CREATE}`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(clienteData)
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al crear cliente');
  }

  return await res.json();
}

export const fetchClientes = createAsyncThunk(
  'clientes/fetchClientes',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      if (!token) throw new Error('No hay token de autenticación');
      const response = await apiGetClientes(token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCliente = createAsyncThunk(
  'clientes/createCliente',
  async (clienteData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      if (!token) throw new Error('No hay token de autenticación');
      const response = await apiCreateCliente(clienteData, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  clientes: [],
  loading: false,
  error: null,
  success: null,
  createdCliente: null
};

const clienteSlice = createSlice({
  name: 'clientes',
  initialState,
  reducers: {
    clearClienteState(state) {
      state.error = null;
      state.success = null;
      state.createdCliente = null;
    },
    resetClientes(state) {
      state.clientes = [];
      state.loading = false;
      state.error = null;
      state.success = null;
      state.createdCliente = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClientes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientes.fulfilled, (state, action) => {
        state.loading = false;
        state.clientes = action.payload;
        state.error = null;
      })
      .addCase(fetchClientes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCliente.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createCliente.fulfilled, (state, action) => {
        state.loading = false;
        state.clientes = [...state.clientes, action.payload];
        state.createdCliente = action.payload;
        state.success = action.payload.message;
        state.error = null;
      })
      .addCase(createCliente.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      });
  }
});

export const { clearClienteState, resetClientes } = clienteSlice.actions;
export default clienteSlice.reducer;