import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import authReducer, { login, logout } from './shared/reducers/auth.reducer.js';
import Header from './shared/layout/header/header-component.jsx';
import Footer from './shared/layout/footer/footer';
import { hasAnyAuthority } from './shared/auth/private-route';
import AppRoutes from './routes.jsx';
import useScrollToTopOnPageChange from './shared/hooks/useScrollToTop';
import ToastContainerApp from './shared/components/toast-container.component.jsx';
import './app.scss';

const baseHref = document.querySelector('base')?.getAttribute('href')?.replace(/\/$/, '') || '/';

export const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getSession(token));
    } else {
      dispatch(logout());
    }
  }, [dispatch]);

  const currentLocale = useSelector(state => state.locale?.currentLocale || 'en');
  const { isAuthenticated, loading: isLoading, account } = useSelector(state => state.authentication);

  const isAdmin = useSelector(state =>
    hasAnyAuthority(state.authentication.account?.authorities)
  );

  useScrollToTopOnPageChange();

  return (
    <div className="app-container d-flex flex-column min-vh-100">
      <ToastContainerApp />
      <Header
        isLoading={isLoading}
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        currentLocale={currentLocale}
        nombreDeUsuario={isAuthenticated ? account.login : ''}
      />

      <main className="flex-grow-1">
        <AppRoutes />
      </main>

      <Footer isAuthenticated={isAuthenticated} />
    </div>
  );
};

export default App;
