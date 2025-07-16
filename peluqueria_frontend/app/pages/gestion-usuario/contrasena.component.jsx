import React, { useState } from 'react';
import '../styles/ChangePasswordPage.scss';

const API_URL = process.env.REACT_APP_API_URL;

const ContrasenaComponent = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (newPassword !== confirmNewPassword) {
      setError('Las contraseñas nuevas no coinciden.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('No estás autenticado.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/change-contrasena`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Error al cambiar la contraseña.');
      }

      setMessage('¡Contraseña cambiada exitosamente!');
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setError(err.message || 'Error inesperado');
    }
  };

  return (
    <div className="change-contrasena-container">
      <h2>Cambiar contraseña</h2>
      <form onSubmit={handleChangePassword}>
        <div className="form-group">
          <label>Contraseña actual:</label>
          <input
            type="contrasena"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Nueva contraseña:</label>
          <input
            type="contrasena"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirmar nueva contraseña:</label>
          <input
            type="contrasena"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="change-contrasena-button">Actualizar contraseña</button>
      </form>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ContrasenaComponent;

