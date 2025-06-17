import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './app/layout/Layout';
import RequireAuth from './app/shared/auth/RequireAuth';
import ErrorPage from './app/shared/error/ErrorPage';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
// Importar otras páginas según necesidad

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Públicas */}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        
        {/* Protegidas */}
        <Route element={<RequireAuth />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
        
        {/* Error */}
        <Route path="*" element={<ErrorPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;