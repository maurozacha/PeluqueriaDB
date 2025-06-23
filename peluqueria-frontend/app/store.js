import { configureStore } from '@reduxjs/toolkit';
import authReducer from './shared/reducers/auth.reducer';
import localeReducer from './shared/reducers/locale.reducer';
// ...otros reducers

const store = configureStore({
  reducer: {
    authentication: authReducer,
    locale: localeReducer,
    // otros...
  },
});

export default store;
