import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthForm.scss';

const Register = () => {
  const [usuario, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (contrasena !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, email, contrasena })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Error en el registro');
      }

      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleRegister} className="auth-form">
        <input type="text" value={usuario} onChange={e => setUsername(e.target.value)} placeholder="Usuario" required />
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Correo electrónico" required />
        <input type="contrasena" value={contrasena} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" required />
        <input type="contrasena" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Confirmar contraseña" required />
        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
        {error && <p className="auth-error">{error}</p>}
      </form>
    </div>
  );
};

export default Register;
