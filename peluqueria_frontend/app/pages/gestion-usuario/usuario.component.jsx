import React, { useEffect, useState } from 'react';
import '../styles/UsuariosPage.scss';
import { jwtDecode } from 'jwt-decode';

const API_URL = process.env.REACT_APP_API_URL;

const UsuarioComponent = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [rolUsuario, setRolUsuario] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRolUsuario(decoded.role);
      } catch (e) {
        console.error('Error al decodificar token', e);
      }
    }
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const res = await fetch(`${API_URL}/usuarios/`);
      const data = await res.json();
      setUsuarios(data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  const cambiarRol = async (usuario, nuevoRol) => {
    try {
      const res = await fetch(`${API_URL}/usuarios/${usuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rol: nuevoRol })
      });
      if (res.ok) {
        fetchUsuarios();
        setMensaje('Rol actualizado correctamente');
      } else {
        setError('Error al actualizar rol');
      }
    } catch (e) {
      setError('Error al conectar con el servidor');
    }
  };

  const cambiarEstado = async (usuario, activo) => {
    try {
      const res = await fetch(`${API_URL}/usuarios/${usuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo })
      });
      if (res.ok) {
        fetchUsuarios();
      }
    } catch (e) {
      console.error('Error al actualizar estado:', e);
    }
  };

  const cambiarClave = async (usuario) => {
    const nuevaClave = prompt('Nueva contraseña:');
    if (!nuevaClave) return;
    try {
      const res = await fetch(`${API_URL}/usuarios/${usuario}/clave`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clave: nuevaClave })
      });
      if (res.ok) {
        alert('Contraseña actualizada');
      } else {
        alert('Error al actualizar contraseña');
      }
    } catch (e) {
      console.error('Error:', e);
    }
  };

  return (
    <div className="usuarios-container">
      <h2>Gestión de Usuarios</h2>

      {mensaje && <p className="mensaje">{mensaje}</p>}
      {error && <p className="error">{error}</p>}

      <div className="tabla-container">
        <table className="tabla">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Activo</th>
              <th>Clave</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.usuario}>
                <td>{u.usuario}</td>
                <td>
                  <select
                    value={u.rol}
                    onChange={(e) => cambiarRol(u.usuario, e.target.value)}
                  >
                    <option value="CLIENTE">CLIENTE</option>
                    <option value="EMPLEADO">EMPLEADO</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={u.activo}
                    onChange={(e) => cambiarEstado(u.usuario, e.target.checked)}
                  />
                </td>
                <td>
                  <button onClick={() => cambiarClave(u.usuario)}>Cambiar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsuarioComponent;
