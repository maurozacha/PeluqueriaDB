import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_CONFIG, apiCall } from '../../config/api';

async function apiGetTurnos(token, params = {}) {
  const queryParams = new URLSearchParams();
  if (params.cliente_id) queryParams.append('cliente_id', params.cliente_id);
  if (params.empleado_id) queryParams.append('empleado_id', params.empleado_id);
  if (params.estado) queryParams.append('estado', params.estado);
  if (params.fecha) queryParams.append('fecha', params.fecha);

  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TURNOS.GET_ALL}?${queryParams.toString()}`;
  return await apiCall(url, 'GET');
}

async function apiCreateTurno(turnoData, token) {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TURNOS.CREATE}`;
  return await apiCall(url, 'POST', turnoData);
}

async function apiGetTurnoById(turnoId, token) {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TURNOS.GET_BY_ID.replace(':turno_id', turnoId)}`;
  return await apiCall(url, 'GET');
}

async function apiGetDisponibilidad(empleadoId, servicioId, token) {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TURNOS.GET_DISPONIBILIDAD.replace(':empleado_id', empleadoId)}?servicio_id=${servicioId}`;
  return await apiCall(url, 'GET');
}

async function apiUpdateEstadoTurno(turnoId, accion, token) {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TURNOS.UPDATE_ESTADO.replace(':turno_id', turnoId)}`;
  return await apiCall(url, 'PUT', { accion });
}

async function apiGetTurnosByCliente(clienteId) {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TURNOS.GET_ALL_BY_CLIENTE_ID.replace(':cliente_id', clienteId)}`;
  return await apiCall(url, 'GET');
}


export const fetchTurnos = createAsyncThunk(
  'turnos/fetchTurnos',
  async (params, { rejectWithValue }) => {
    try {
      const response = await apiGetTurnos(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTurnoById = createAsyncThunk(
  'turnos/fetchTurnoById',
  async (turnoId, { rejectWithValue }) => {
    try {
      const response = await apiGetTurnoById(turnoId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDisponibilidad = createAsyncThunk(
  'turnos/fetchDisponibilidad',
  async ({ empleadoId, servicioId }, { rejectWithValue }) => {
    try {
      const response = await apiGetDisponibilidad(empleadoId, servicioId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createTurno = createAsyncThunk(
  'turnos/createTurno',
  async (turnoData, { rejectWithValue }) => {
    try {
      const response = await apiCreateTurno(turnoData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateEstadoTurno = createAsyncThunk(
  'turnos/updateEstadoTurno',
  async ({ turnoId, accion }, { rejectWithValue }) => {
    try {
      const response = await apiUpdateEstadoTurno(turnoId, accion);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const crearReserva = createAsyncThunk(
  'turno/crearReserva',
  async (reservaData, { rejectWithValue }) => {
    try {
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TURNOS.RESERVAR}`;
      const response = await apiCall(url, 'POST', reservaData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const procesarPago = createAsyncThunk(
  'turno/procesarPago',
  async (pagoData, { rejectWithValue }) => {
    try {
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TURNOS.PROCESAR_PAGO}`;
      const response = await apiCall(url, 'POST', pagoData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTurnosByCliente = createAsyncThunk(
  'turnos/fetchTurnosByCliente',
  async (clienteId, { rejectWithValue }) => {
    try {
      const response = await apiGetTurnosByCliente(clienteId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelarReserva = createAsyncThunk(
  'turno/cancelarReserva',
  async (turnoId, { rejectWithValue }) => {
    try {
      const url = `${API_CONFIG.BASE_URL}/turnos/cancelar`;
      const response = await apiCall(url, 'POST', { turnoId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTurno = createAsyncThunk(
  'turnos/updateTurno',
  async ({ turnoId, turnoData }, { rejectWithValue }) => {
    try {
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TURNOS.GET_BY_ID.replace(':turno_id', turnoId)}`;
      const response = await apiCall(url, 'PUT', turnoData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



const initialState = {
  turnos: [],
  turnosDisponibles: [],
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
        state.turnosDisponibles = [];
      })
      .addCase(fetchDisponibilidad.fulfilled, (state, action) => {
        state.loading = false;
        state.turnosDisponibles = action.payload;
        state.error = null;
      })
      .addCase(fetchDisponibilidad.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.turnosDisponibles = [];
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
      })
      .addCase(crearReserva.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(crearReserva.fulfilled, (state, action) => {
        state.loading = false;
        state.turnoActual = action.payload.turno;
        state.turnosDisponibles = state.turnosDisponibles.filter(
          turno => turno.id !== action.payload.turno.id
        );

        state.error = null;
      })
      .addCase(crearReserva.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(procesarPago.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(procesarPago.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = 'Pago procesado exitosamente';
      })
      .addCase(procesarPago.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTurnosByCliente.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTurnosByCliente.fulfilled, (state, action) => {
        state.loading = false;
        state.turnos = action.payload;
        state.error = null;
      })
      .addCase(fetchTurnosByCliente.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(cancelarReserva.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelarReserva.fulfilled, (state, action) => {
        state.loading = false;
        state.turnos = state.turnos.filter(turno => turno.id !== action.meta.arg);
        state.success = 'Turno cancelado exitosamente';
      })
      .addCase(cancelarReserva.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTurno.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTurno.fulfilled, (state, action) => {
        state.loading = false;
        state.turnos = state.turnos.map(turno =>
          turno.id === action.payload.id ? action.payload : turno
        );
        state.turnoActual = action.payload;
        state.success = 'Turno actualizado exitosamente';
      })
      .addCase(updateTurno.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  }
});

export const { clearTurnoState, resetTurnos, setTurnoActual } = turnoSlice.actions;
export default turnoSlice.reducer;