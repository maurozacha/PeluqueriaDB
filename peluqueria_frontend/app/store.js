import { configureStore } from '@reduxjs/toolkit';
import authReducer from './shared/reducers/auth.reducer';
import localeReducer from './shared/reducers/locale.reducer';
import turnoReducer from './shared/reducers/entities/turno.reducer';
import servicioReducer from './shared/reducers/entities/servicio.reducer';
import pagoReducer from './shared/reducers/entities/pago.reducer';
import empleadoReducer from './shared/reducers/entities/empleado.reducer';
import clienteReducer from './shared/reducers/entities/cliente.reducer';

// TODO - AGREGAR OTROS REDUCER DE ENTIDADES
const store = configureStore({
  reducer: {
    auth: authReducer,
    locale: localeReducer,
    turno: turnoReducer,
    servicio: servicioReducer,
    pago: pagoReducer,
    cliente: clienteReducer,
    empleado: empleadoReducer
  },
});

export default store;
