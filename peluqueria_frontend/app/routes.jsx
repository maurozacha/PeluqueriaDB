import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from '../app/shared/layout/layout';
import PageNotFound from '../app/shared/error/page-not-found';
import HomeComponent from './modules/home/home.component';
import Login from '../app/pages/gestion-usuario/login.component';
import Register from '../app/pages/gestion-usuario/registro.component';

const RequireAuth = () => {
  const token = localStorage.getItem('token');
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomeComponent />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        
        <Route element={<RequireAuth />}>
        </Route>
        
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;