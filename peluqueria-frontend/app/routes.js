import { lazy } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './app/layout/Layout';
import ErrorPage from './app/shared/error/ErrorPage';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

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
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />

        <Route element={<RequireAuth />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<ErrorPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
