import { configureStore } from '@reduxjs/toolkit';
import authReducer from './shared/reducers/auth.reducer';
import localeReducer from './shared/reducers/locale.reducer';
import turnoReducer from './shared/reducers/entities/turno.reducer';

// TODO - AGREGAR OTROS REDUCER DE ENTIDADES
const store = configureStore({
  reducer: {
    auth: authReducer,
    locale: localeReducer,
    turno: turnoReducer,
  },
});

export default store;
