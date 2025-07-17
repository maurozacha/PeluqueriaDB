import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Provider } from 'react-redux';
import store from './store';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.scss';
import AppRoutes from './routes.jsx';
import { hasAnyAuthority } from './shared/auth/private-route';
import ToastNotifier from './shared/components/toast-notifier.component.jsx';
import useScrollToTopOnPageChange from './shared/hooks/useScrollToTop';
import Footer from './shared/layout/footer/footer';
import GlobalLoader from './shared/components/global-loader.component.jsx';
import { ToastContainer } from 'react-toastify';

const baseHref = document.querySelector('base')?.getAttribute('href')?.replace(/\/$/, '') || '/';

export const App = () => {
  const dispatch = useDispatch();
  const [isInitializing, setIsInitializing] = useState(true);
  const { isAuthenticated, loading: isLoading, account } = useSelector(state => state.auth);
  const isAdmin = useSelector(state => hasAnyAuthority(state.auth.account?.authorities));

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useScrollToTopOnPageChange();

  const showGlobalLoader = isLoading || isInitializing;

  return (
    <Provider store={store}>
      <div className="app-container d-flex flex-column min-vh-100">
        <GlobalLoader loading={showGlobalLoader} />
        <ToastNotifier />
        <main className="flex-grow-1">
          <ToastContainer
            theme="dark"
            toastStyle={{
              color: '#ffffff'
            }} />
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </Provider>
  );
};

export default App;