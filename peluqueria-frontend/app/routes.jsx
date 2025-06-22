import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from '../app/shared/layout/layout';
import PageNotFound from '../app/shared/error/page-not-found';

// Importación normal sin lazy
import { Login } from './shared/components/auth/login.component';
import Header from './shared/layout/header/header';

// Componente para proteger rutas (RequireAuth)
const RequireAuth = () => {
  const token = localStorage.getItem('token');
  // Si no hay token, redirigir a login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  // Si hay token, renderizar las rutas hijas
  return <Outlet />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Header />} />
        <Route path="login" element={<Login />} />

        {/* <Route element={<RequireAuth />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route> */}

        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
