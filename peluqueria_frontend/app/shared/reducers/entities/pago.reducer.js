import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_CONFIG } from '../config/api';

async function apiGetPagoById(pagoId, token) {
  const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PAGOS.GET_BY_ID.replace(':pago_id', pagoId)}`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al obtener el pago');
  }

  return await res.json();
}

async function apiGetPagosByTurno(turnoId, token) {
  const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PAGOS.GET_BY_TURNO.replace(':turno_id', turnoId)}`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al obtener pagos del turno');
  }

  return await res.json();
}

async function apiCancelarPago(pagoId, token) {
  const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PAGOS.CANCELAR.replace(':pago_id', pagoId)}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al cancelar el pago');
  }

  return await res.json();
}

export const fetchPagoById = createAsyncThunk(
  'pagos/fetchPagoById',
  async (pagoId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      if (!token) throw new Error('No hay token de autenticación');
      const response = await apiGetPagoById(pagoId, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPagosByTurno = createAsyncThunk(
  'pagos/fetchPagosByTurno',
  async (turnoId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      if (!token) throw new Error('No hay token de autenticación');
      const response = await apiGetPagosByTurno(turnoId, token);
      return { turnoId, pagos: response.data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelarPago = createAsyncThunk(
  'pagos/cancelarPago',
  async (pagoId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      if (!token) throw new Error('No hay token de autenticación');
      const response = await apiCancelarPago(pagoId, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  pagos: {},
  pagoActual: null,
  loading: false,
  error: null,
  success: null
};

const pagoSlice = createSlice({
  name: 'pagos',
  initialState,
  reducers: {
    clearPagoState(state) {
      state.error = null;
      state.success = null;
    },
    resetPagos(state) {
      state.pagos = {};
      state.pagoActual = null;
      state.loading = false;
      state.error = null;
      state.success = null;
    },
    setPagoActual(state, action) {
      state.pagoActual = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPagoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPagoById.fulfilled, (state, action) => {
        state.loading = false;
        state.pagoActual = action.payload;
        state.error = null;
      })
      .addCase(fetchPagoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPagosByTurno.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPagosByTurno.fulfilled, (state, action) => {
        state.loading = false;
        const { turnoId, pagos } = action.payload;
        state.pagos[turnoId] = pagos;
        state.error = null;
      })
      .addCase(fetchPagosByTurno.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(cancelarPago.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(cancelarPago.fulfilled, (state, action) => {
        state.loading = false;
        for (const turnoId in state.pagos) {
          state.pagos[turnoId] = state.pagos[turnoId].map(pago => 
            pago.id === action.payload.id ? action.payload : pago
          );
        }
        if (state.pagoActual && state.pagoActual.id === action.payload.id) {
          state.pagoActual = action.payload;
        }
        state.success = 'Pago cancelado exitosamente';
        state.error = null;
      })
      .addCase(cancelarPago.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      });
  }
});

export const { clearPagoState, resetPagos, setPagoActual } = pagoSlice.actions;
export default pagoSlice.reducer;