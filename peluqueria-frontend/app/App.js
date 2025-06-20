import 'react-toastify/dist/ReactToastify.css';
import './app.scss';
import './theme.css';
import './primereact.min.css';
import 'primeicons/primeicons.css';

import './config/dayjs';
import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { getSession } from './shared/reducers/authentication';
import { getProfile } from './shared/reducers/application-profile';
import Header from './shared/layout/header/header';
import Footer from './shared/layout/footer/footer';
import { hasAnyAuthority } from './shared/auth/private-route';
import ErrorBoundary from './shared/error/error-boundary';
import { AUTHORITIES } from './constants/constants';
import AppRoutes from './routes';
import useScrollToTopOnPageChange from './shared/hooks/useScrollToTop';
import ToastContainerApp from './shared/componentes/toast-container.component';

const baseHref = document.querySelector('base')?.getAttribute('href')?.replace(/\/$/, '') || '/';

export const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSession());
    dispatch(getProfile());
  }, [dispatch]);

  const currentLocale = useSelector(state => state.locale.currentLocale);
  const { isAuthenticated, loading: isLoading, account } = useSelector(state => state.authentication);
  const { ribbonEnv, inProduction: isInProduction, isOpenAPIEnabled } = useSelector(state => state.applicationProfile);
  
  const isAdmin = useSelector(state => 
    hasAnyAuthority(state.authentication.account?.authorities || [], [AUTHORITIES.ADMIN])
  );

  useScrollToTopOnPageChange();

  return (
    <Router basename={baseHref}>
      <div className="app-container d-flex flex-column">
        <ToastContainerApp />

        <ErrorBoundary>
          <Header
            isLoading={isLoading}
            isAuthenticated={isAuthenticated}
            isAdmin={isAdmin}
            currentLocale={currentLocale}
            ribbonEnv={ribbonEnv}
            isInProduction={isInProduction}
            isOpenAPIEnabled={isOpenAPIEnabled}
            nombreDeUsuario={isAuthenticated ? account.login : ''} 
          />
        </ErrorBoundary>

        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>

        <Footer isAuthenticated={isAuthenticated} />
      </div>
    </Router>
  );
};

export default App;