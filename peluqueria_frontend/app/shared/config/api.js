const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    CLIENTES: {
      GET_ALL: '/clientes',
      CREATE: '/clientes',
      GET_BY_ID: '/clientes/:cliente_id'
    },
    EMPLEADOS: {
      GET_ALL: '/empleados',
      CREATE: '/empleados',
      GET_BY_ID: '/empleados/:empleado_id'
    },
    SERVICIOS: {
      GET_ALL: '/servicios',
      CREATE: '/servicios',
      GET_BY_ID: '/servicios/:servicio_id',
      GET_BY_EMPLEADO: '/empleados/:empleado_id/servicios'
    },
    TURNOS: {
      GET_ALL: '/turnos',
      CREATE: '/turnos',
      GET_BY_ID: '/turnos/:turno_id',
      GET_DISPONIBILIDAD: '/empleados/:empleado_id/disponibilidad',
      UPDATE_ESTADO: '/turnos/:turno_id/estado'
    },
    PAGOS: {
      GET_BY_ID: '/pagos/:pago_id',
      GET_BY_TURNO: '/turnos/:turno_id/pagos',
      CANCELAR: '/pagos/:pago_id/cancelar'
    },
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh-token',
      REGISTER: '/auth/register',
    }
  }
};

export const apiCall = async (url, method, data, headers = {}) => {
  const token = localStorage.getItem('authToken');
  const authHeader = token ? { 'Authorization': `Bearer ${token}` } : {};

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
      ...headers
    },
    credentials: 'include'
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(url, config);
  
  if (response.status === 204) {
    return null;
  }

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || 'Algo salió mal');
  }

  return responseData;
};