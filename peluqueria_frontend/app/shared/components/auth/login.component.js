import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../../reducers/auth.reducer'; 

export const Login = () => {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.auth.loading);
  const error = useSelector(state => state.auth.error);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  const [usuario, setUsername] = useState('');
  const [contrasena, setPassword] = useState('');

  const handleLogin = () => {
    dispatch(login({ usuario, contrasena }));
  };

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={() => dispatch(logout())}>Cerrar sesión</button>
      ) : (
        <>
          <input value={usuario} onChange={e => setUsername(e.target.value)} placeholder="Usuario" />
          <input type="contrasena" value={contrasena} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" />
          <button onClick={handleLogin} disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </>
      )}
    </div>
  );
};
