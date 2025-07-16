import React,{ useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import 'bootstrap/dist/css/bootstrap.min.css';
import './app.scss';
import AppRoutes from './routes.jsx';
import { hasAnyAuthority } from './shared/auth/private-route';
import ToastNotifier from './shared/components/toast-notifier.component.jsx';
import useScrollToTopOnPageChange from './shared/hooks/useScrollToTop';
import Footer from './shared/layout/footer/footer';
import { logout } from './shared/reducers/auth.reducer.js';

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

  const { isAuthenticated, loading: isLoading, account } = useSelector(state => state.auth);

  const isAdmin = useSelector(state =>
    hasAnyAuthority(state.auth.account?.authorities)
  );

  useScrollToTopOnPageChange();

  return (
    <div className="app-container d-flex flex-column min-vh-100">
      <ToastNotifier />
      <main className="flex-grow-1">
        <AppRoutes />
      </main>
      <Footer isAuthenticated={isAuthenticated} />
    </div>
  );
};

export default App;
