import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../../reducers/auth.reducer'; 

export const Login = () => {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.authentication.loading);
  const error = useSelector(state => state.authentication.error);
  const isAuthenticated = useSelector(state => state.authentication.isAuthenticated);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    dispatch(login({ username, password }));
  };

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={() => dispatch(logout())}>Cerrar sesión</button>
      ) : (
        <>
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Usuario" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" />
          <button onClick={handleLogin} disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </>
      )}
    </div>
  );
};
