import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentLocale: 'es',
};

const localeSlice = createSlice({
  name: 'locale',
  initialState,
  reducers: {
    setLocale: (state, action) => {
      state.currentLocale = action.payload;
    },
  },
});

export const { setLocale } = localeSlice.actions;

export default localeSlice.reducer;
