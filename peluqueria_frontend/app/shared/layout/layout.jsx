import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './header/header';
import '../../shared/styles/layout.scss';
import ToastNotifier from '../components/toast-notifier.component';

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className={`app-container ${isHomePage ? 'home-layout' : 'default-layout'}`}>
      <ToastNotifier />
      <Header />
      <main>
        {isHomePage ? (
          <Outlet /> 
        ) : (
          <div className="content-card">
            <Outlet /> 
          </div>
        )}
      </main>
    
    </div>
  );
};

export default Layout;