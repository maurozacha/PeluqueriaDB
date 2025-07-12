import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_CONFIG } from '../config/api';

async function apiGetServicios(token, activos = true) {
  const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SERVICIOS.GET_ALL}?activos=${activos}`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al obtener servicios');
  }

  return await res.json();
}

async function apiGetServicioById(servicioId, token) {
  const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SERVICIOS.GET_BY_ID.replace(':servicio_id', servicioId)}`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al obtener el servicio');
  }

  return await res.json();
}

async function apiCreateServicio(servicioData, token) {
  const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SERVICIOS.CREATE}`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(servicioData)
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al crear servicio');
  }

  return await res.json();
}

async function apiGetServiciosByEmpleado(empleadoId, token) {
  const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SERVICIOS.GET_BY_EMPLEADO.replace(':empleado_id', empleadoId)}`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al obtener servicios del empleado');
  }

  return await res.json();
}

export const fetchServicios = createAsyncThunk(
  'servicios/fetchServicios',
  async (activos = true, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      if (!token) throw new Error('No hay token de autenticación');
      const response = await apiGetServicios(token, activos);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchServicioById = createAsyncThunk(
  'servicios/fetchServicioById',
  async (servicioId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      if (!token) throw new Error('No hay token de autenticación');
      const response = await apiGetServicioById(servicioId, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createServicio = createAsyncThunk(
  'servicios/createServicio',
  async (servicioData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      if (!token) throw new Error('No hay token de autenticación');
      const response = await apiCreateServicio(servicioData, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchServiciosByEmpleado = createAsyncThunk(
  'servicios/fetchServiciosByEmpleado',
  async (empleadoId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      if (!token) throw new Error('No hay token de autenticación');
      const response = await apiGetServiciosByEmpleado(empleadoId, token);
      return { empleadoId, servicios: response.data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  servicios: [],
  serviciosPorEmpleado: {},
  servicioActual: null,
  loading: false,
  error: null,
  success: null,
  createdServicio: null
};

const servicioSlice = createSlice({
  name: 'servicios',
  initialState,
  reducers: {
    clearServicioState(state) {
      state.error = null;
      state.success = null;
      state.createdServicio = null;
    },
    resetServicios(state) {
      state.servicios = [];
      state.serviciosPorEmpleado = {};
      state.servicioActual = null;
      state.loading = false;
      state.error = null;
      state.success = null;
      state.createdServicio = null;
    },
    setServicioActual(state, action) {
      state.servicioActual = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServicios.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServicios.fulfilled, (state, action) => {
        state.loading = false;
        state.servicios = action.payload;
        state.error = null;
      })
      .addCase(fetchServicios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchServicioById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServicioById.fulfilled, (state, action) => {
        state.loading = false;
        state.servicioActual = action.payload;
        state.error = null;
      })
      .addCase(fetchServicioById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createServicio.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createServicio.fulfilled, (state, action) => {
        state.loading = false;
        state.servicios = [...state.servicios, action.payload];
        state.createdServicio = action.payload;
        state.success = 'Servicio creado exitosamente';
        state.error = null;
      })
      .addCase(createServicio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      })
      .addCase(fetchServiciosByEmpleado.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiciosByEmpleado.fulfilled, (state, action) => {
        state.loading = false;
        const { empleadoId, servicios } = action.payload;
        state.serviciosPorEmpleado[empleadoId] = servicios;
        state.error = null;
      })
      .addCase(fetchServiciosByEmpleado.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearServicioState, resetServicios, setServicioActual } = servicioSlice.actions;
export default servicioSlice.reducer;