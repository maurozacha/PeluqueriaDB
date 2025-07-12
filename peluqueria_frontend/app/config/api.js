export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      VERIFY: '/auth/verify'
    },
    CLIENTES: {
      GET_ALL: '/clientes/get',
      CREATE: '/clientes/create'
    },
    EMPLEADOS: {
      GET_ALL: '/empleados/listar',
      GET_BY_ID: '/empleados',
      CREATE: '/empleados/create'
    }
  }
};