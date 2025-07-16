import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_CONFIG, apiCall } from '../../config/api';

const apiGetServicios = async (activos = true) => {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SERVICIOS.GET_ALL}?activos=${activos}`;
  return apiCall(url, 'GET');
};

const apiGetServiciosByEmpleado = async (empleadoId) => {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SERVICIOS.GET_BY_EMPLEADO.replace(':empleado_id', empleadoId)}`;
  return apiCall(url, 'GET');
};

const apiGetEmpleadosByServicio = async (servicioId) => {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SERVICIOS.GET_EMPLEADOS.replace(':servicio_id', servicioId)}`;
  return apiCall(url, 'GET');
};

export const fetchServicios = createAsyncThunk(
  'servicios/fetchServicios',
  async (activos = true, { rejectWithValue }) => {
    try {
      const response = await apiGetServicios(activos);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchServiciosByEmpleado = createAsyncThunk(
  'servicios/fetchServiciosByEmpleado',
  async (empleadoId, { rejectWithValue }) => {
    try {
      const response = await apiGetServiciosByEmpleado(empleadoId);
      return { empleadoId, servicios: response.data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchEmpleadosByServicio = createAsyncThunk(
  'servicios/fetchEmpleadosByServicio',
  async (servicioId, { rejectWithValue }) => {
    try {
      const response = await apiGetEmpleadosByServicio(servicioId);
      return { servicioId, empleados: response.data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  servicios: [],
  serviciosPorEmpleado: {},
  empleadosPorServicio: [],
  loading: false,
  error: null,
  success: null,
  currentEmpleado: null,
  tiposServicio: ['CORTE', 'TINTURA', 'BARBERIA']
};

const servicioSlice = createSlice({
  name: 'servicio',
  initialState,
  reducers: {
    clearServicioState(state) {
      state.error = null;
      state.success = null;
    },
    setCurrentEmpleado(state, action) {
      state.currentEmpleado = action.payload;
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
      })
      .addCase(fetchEmpleadosByServicio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmpleadosByServicio.fulfilled, (state, action) => {
        state.loading = false;
        const { empleados } = action.payload;
        state.empleadosPorServicio = empleados;
        state.error = null;
      })
      .addCase(fetchEmpleadosByServicio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearServicioState, setCurrentEmpleado } = servicioSlice.actions;
export default servicioSlice.reducer;