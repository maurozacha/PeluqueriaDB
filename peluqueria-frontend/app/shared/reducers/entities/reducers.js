import { combineReducers } from '@reduxjs/toolkit';
import clienteReducer from './clienteReducer';
import empleadoReducer from './empleadoReducer';
import servicioReducer from './servicioReducer';
import reservaReducer from './reservaReducer';
import turnoReducer from './turnoReducer';

const entitiesReducers = combineReducers({
  cliente: clienteReducer,
  empleado: empleadoReducer,
  servicio: servicioReducer,
  reserva: reservaReducer,
  turno: turnoReducer,
});

export default entitiesReducers;