import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    // No está autenticado: redirigir a login
    return <Navigate to="/login" replace />;
  }
  // Está autenticado: mostrar children (la ruta privada)
  return children;
};


export const hasAnyAuthority = (authorities, hasAnyAuthorities) => {
  if (authorities && authorities.length !== 0) {
    if (hasAnyAuthorities.length === 0) {
      return true;
    }
    return hasAnyAuthorities.some(auth => authorities.includes(auth));
  }
  return false;
};


export default PrivateRoute;
