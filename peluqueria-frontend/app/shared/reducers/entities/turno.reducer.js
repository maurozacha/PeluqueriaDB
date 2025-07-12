import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_CONFIG } from '../config/api';

// Funciones API para turnos
async function apiGetTurnos(token, params = {}) {
  const queryParams = new URLSearchParams();
  
  if (params.cliente_id) queryParams.append('cliente_id', params.cliente_id);
  if (params.empleado_id) queryParams.append('empleado_id', params.empleado_id);
  if (params.estado) queryParams.append('estado', params.estado);
  if (params.fecha) queryParams.append('fecha', params.fecha);

  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TURNOS.GET_ALL}?${queryParams.toString()}`;
  
  const res = await fetch(url, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al obtener turnos');
  }

  return await res.json();
}

async function apiCreateTurno(turnoData, token) {
  const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TURNOS.CREATE}`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(turnoData)
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al crear turno');
  }

  return await res.json();
}

async function apiGetTurnoById(turnoId, token) {
  const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TURNOS.GET_BY_ID.replace(':turno_id', turnoId)}`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al obtener el turno');
  }

  return await res.json();
}

async function apiGetDisponibilidad(empleadoId, fecha, token) {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TURNOS.GET_DISPONIBILIDAD.replace(':empleado_id', empleadoId)}?fecha=${fecha}`;
  
  const res = await fetch(url, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al obtener disponibilidad');
  }

  return await res.json();
}

async function apiUpdateEstadoTurno(turnoId, accion, token) {
  const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TURNOS.UPDATE_ESTADO.replace(':turno_id', turnoId)}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ accion })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al actualizar estado del turno');
  }

  return await res.json();
}

// Thunks
export const fetchTurnos = createAsyncThunk(
  'turnos/fetchTurnos',
  async (params, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      if (!token) throw new Error('No hay token de autenticación');
      const response = await apiGetTurnos(token, params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTurnoById = createAsyncThunk(
  'turnos/fetchTurnoById',
  async (turnoId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      if (!token) throw new Error('No hay token de autenticación');
      const response = await apiGetTurnoById(turnoId, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDisponibilidad = createAsyncThunk(
  'turnos/fetchDisponibilidad',
  async ({ empleadoId, fecha }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      if (!token) throw new Error('No hay token de autenticación');
      const response = await apiGetDisponibilidad(empleadoId, fecha, token);
      return { empleadoId, fecha, slots: response.data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createTurno = createAsyncThunk(
  'turnos/createTurno',
  async (turnoData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      if (!token) throw new Error('No hay token de autenticación');
      const response = await apiCreateTurno(turnoData, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateEstadoTurno = createAsyncThunk(
  'turnos/updateEstadoTurno',
  async ({ turnoId, accion }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      if (!token) throw new Error('No hay token de autenticación');
      const response = await apiUpdateEstadoTurno(turnoId, accion, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Estado inicial
const initialState = {
  turnos: [],
  turnoActual: null,
  disponibilidad: {},
  loading: false,
  error: null,
  success: null,
  createdTurno: null,
  updatedTurno: null
};

const turnoSlice = createSlice({
  name: 'turnos',
  initialState,
  reducers: {
    clearTurnoState(state) {
      state.error = null;
      state.success = null;
      state.createdTurno = null;
      state.updatedTurno = null;
    },
    resetTurnos(state) {
      state.turnos = [];
      state.turnoActual = null;
      state.disponibilidad = {};
      state.loading = false;
      state.error = null;
      state.success = null;
      state.createdTurno = null;
      state.updatedTurno = null;
    },
    setTurnoActual(state, action) {
      state.turnoActual = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTurnos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTurnos.fulfilled, (state, action) => {
        state.loading = false;
        state.turnos = action.payload;
        state.error = null;
      })
      .addCase(fetchTurnos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTurnoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTurnoById.fulfilled, (state, action) => {
        state.loading = false;
        state.turnoActual = action.payload;
        state.error = null;
      })
      .addCase(fetchTurnoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDisponibilidad.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDisponibilidad.fulfilled, (state, action) => {
        state.loading = false;
        const { empleadoId, fecha, slots } = action.payload;
        if (!state.disponibilidad[empleadoId]) {
          state.disponibilidad[empleadoId] = {};
        }
        state.disponibilidad[empleadoId][fecha] = slots;
        state.error = null;
      })
      .addCase(fetchDisponibilidad.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTurno.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createTurno.fulfilled, (state, action) => {
        state.loading = false;
        state.turnos = [...state.turnos, action.payload];
        state.createdTurno = action.payload;
        state.success = 'Turno creado exitosamente';
        state.error = null;
      })
      .addCase(createTurno.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      })
      .addCase(updateEstadoTurno.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateEstadoTurno.fulfilled, (state, action) => {
        state.loading = false;
        state.turnos = state.turnos.map(turno => 
          turno.id === action.payload.id ? action.payload : turno
        );
        if (state.turnoActual && state.turnoActual.id === action.payload.id) {
          state.turnoActual = action.payload;
        }
        state.updatedTurno = action.payload;
        state.success = `Turno ${action.meta.arg.accion} exitosamente`;
        state.error = null;
      })
      .addCase(updateEstadoTurno.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      });
  }
});

export const { clearTurnoState, resetTurnos, setTurnoActual } = turnoSlice.actions;
export default turnoSlice.reducer;