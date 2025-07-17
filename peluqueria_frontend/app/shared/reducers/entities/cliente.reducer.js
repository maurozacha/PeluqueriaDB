import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_CONFIG, apiCall } from '../../config/api';

export const fetchClientes = createAsyncThunk(
  'clientes/fetchClientes',
  async (_, { getState, rejectWithValue }) => {
    try {
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CLIENTES.GET_ALL}`;
      const response = await apiCall(url, 'GET');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchClienteById = createAsyncThunk(
  'clientes/fetchClienteById',
  async (clienteId, { rejectWithValue }) => {
    try {
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CLIENTES.GET_BY_ID}?id=${clienteId}`;
      const response = await apiCall(url, 'GET');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCliente = createAsyncThunk(
  'clientes/createCliente',
  async (clienteData, { rejectWithValue }) => {
    try {
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CLIENTES.CREATE}`;
      const response = await apiCall(url, 'POST', clienteData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCliente = createAsyncThunk(
  'clientes/updateCliente',
  async ({ clienteId, clienteData }, { rejectWithValue }) => {
    try {
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CLIENTES.UPDATE}`; 
      const response = await apiCall(url, 'PUT', { id: clienteId, ...clienteData });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCliente = createAsyncThunk(
  'clientes/deleteCliente',
  async (clienteId, { rejectWithValue }) => {
    try {
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CLIENTES.GET_BY_ID.replace(':cliente_id', clienteId)}`;
      await apiCall(url, 'DELETE');
      return clienteId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  clientes: [],
  clienteActual: null,
  loading: false,
  error: null,
  success: null,
  createdCliente: null,
  updatedCliente: null,
  deletedClienteId: null
};

const clienteSlice = createSlice({
  name: 'clientes',
  initialState,
  reducers: {
    clearClienteState(state) {
      state.error = null;
      state.success = null;
      state.createdCliente = null;
      state.updatedCliente = null;
      state.deletedClienteId = null;
    },
    resetClientes(state) {
      state.clientes = [];
      state.clienteActual = null;
      state.loading = false;
      state.error = null;
      state.success = null;
      state.createdCliente = null;
      state.updatedCliente = null;
      state.deletedClienteId = null;
    },
    setClienteActual(state, action) {
      state.clienteActual = action.payload;
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
      .addCase(fetchClienteById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.clienteActual = null;
      })
      .addCase(fetchClienteById.fulfilled, (state, action) => {
        state.loading = false;
        state.clienteActual = action.payload;
        state.error = null;
      })
      .addCase(fetchClienteById.rejected, (state, action) => {
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
        state.success = 'Cliente creado exitosamente';
        state.error = null;
      })
      .addCase(createCliente.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      })
      .addCase(updateCliente.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateCliente.fulfilled, (state, action) => {
        state.loading = false;
        state.clientes = state.clientes.map(cliente => 
          cliente.id === action.payload.id ? action.payload : cliente
        );
        if (state.clienteActual && state.clienteActual.id === action.payload.id) {
          state.clienteActual = action.payload;
        }
        state.updatedCliente = action.payload;
        state.success = 'Cliente actualizado exitosamente';
        state.error = null;
      })
      .addCase(updateCliente.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      })
      .addCase(deleteCliente.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteCliente.fulfilled, (state, action) => {
        state.loading = false;
        state.clientes = state.clientes.filter(cliente => cliente.id !== action.payload);
        if (state.clienteActual && state.clienteActual.id === action.payload) {
          state.clienteActual = null;
        }
        state.deletedClienteId = action.payload;
        state.success = 'Cliente eliminado exitosamente';
        state.error = null;
      })
      .addCase(deleteCliente.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      });
  }
});

export const { clearClienteState, resetClientes, setClienteActual } = clienteSlice.actions;
export default clienteSlice.reducer;