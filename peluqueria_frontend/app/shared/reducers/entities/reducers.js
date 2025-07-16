import { combineReducers } from '@reduxjs/toolkit';
import clienteReducer from './cliente.reducer';
import empleadoReducer from './empleado.reducer';
import servicioReducer from './servicio.reducer';
import turnoReducer from './turno.reducer';
import pagoReducer from './pago.reducer';
import authReducer from '../auth.reducer';

const rootReducer = combineReducers({
  cliente: clienteReducer,
  empleado: empleadoReducer,
  servicio: servicioReducer,
  turno: turnoReducer,
  pago: pagoReducer,
  auth: authReducer
});

export default rootReducer;