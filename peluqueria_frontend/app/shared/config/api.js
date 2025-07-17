const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    CLIENTES: {
      GET_ALL: '/clientes',
      CREATE: '/clientes',
      GET_BY_ID: '/clientes/getone',
      UPDATE: '/clientes/update'
    },
    EMPLEADOS: {
      GET_ALL: '/empleados',
      CREATE: '/empleados',
      GET_BY_ID: '/empleados/:empleado_id',
      UPDATE: '/empleados/update'
    },
    SERVICIOS: {
      GET_ALL: '/servicios',
      CREATE: '/servicios',
      GET_BY_ID: '/servicios/:servicio_id',
      GET_BY_EMPLEADO: '/empleados/:empleado_id/servicios',
      GET_EMPLEADOS: '/servicios/:servicio_id/empleados'
    },
    TURNOS: {
      GET_ALL: '/turnos',
      CREATE: '/turnos',
      GET_BY_ID: '/turnos/:turno_id',
      GET_ALL_BY_CLIENTE_ID: '/turnos/cliente/:cliente_id',
      RESERVAR: '/turnos/reservar',
      GET_DISPONIBILIDAD: '/turnos/disponibilidad/:empleado_id',
      PROCESAR_PAGO: '/turnos/procesar-pago' 
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
      USUARIOS: '/auth/usuarios'
    },
    METODOS_PAGO: {
      GET_ALL: '/metodos-pago'
    }
  }
};

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
};

export const apiCall = async (url, method, data, headers = {}) => {
  const token = localStorage.getItem('authToken');

  if (token && isTokenExpired(token)) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    throw new Error('Token expirado');
  }

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

  try {
    const response = await fetch(url, config);

    if (response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      throw new Error('Sesión expirada');
    }

    if (response.status === 204) {
      return null;
    }

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Algo salió mal');
    }

    return responseData;
  } catch (error) {
    if (error.message === 'Token expirado' || error.message === 'Sesión expirada') {
      if (typeof window !== 'undefined' && window.store) {
        window.store.dispatch(logout());
      }
    }
    throw error;
  }
};

export const setupApiInterceptor = (store) => {
  window.store = store;
};