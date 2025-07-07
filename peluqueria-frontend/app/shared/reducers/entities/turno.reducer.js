import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiCall } from '../../services/api';

const API_BASE_URL = `http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}`;


export const fetchTurnos = createAsyncThunk('turnos/fetchAll', async () => {
  return await apiCall(`${API_BASE_URL}/turnos`, 'GET');
});

export const fetchTurnoById = createAsyncThunk('turnos/fetchById', async (id) => {
  return await apiCall(`${API_BASE_URL}/turnos/${id}`, 'GET');
});

export const reservarTurno = createAsyncThunk(
  'turnos/reservar',
  async ({ turnoId, data }) => {
    return await apiCall(`${API_BASE_URL}/turnos/${turnoId}/reservar`, 'POST', data);
  }
);

const turnoSlice = createSlice({
  name: 'turno',
  initialState: {
    list: [],
    loading: false,
    error: null,
    current: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTurnos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTurnos.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchTurnos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchTurnoById.fulfilled, (state, action) => {
        state.current = action.payload;
        state.loading = false;
      })
      .addCase(reservarTurno.fulfilled, (state, action) => {
        state.loading = false;
      });
  },
});

export default turnoSlice.reducer;