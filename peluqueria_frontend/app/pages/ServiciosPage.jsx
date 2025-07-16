import React, { useEffect, useState } from 'react';
import '../styles/ServiciosPage.scss';
import { jwtDecode } from 'jwt-decode';
import { NavItem, NavLink, NavbarBrand, NavDropdown, DropdownItem } from 'reactstrap';

const API_URL = process.env.REACT_APP_API_URL;

const ServiciosPage = () => {
  const [servicios, setServicios] = useState([]);
  const [nuevoServicio, setNuevoServicio] = useState({ nombre: '', descripcion: '', precio: '', duracion_estimada: '' });
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [rolUsuario, setRolUsuario] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Rol del usuario:", decoded.role);
        setRolUsuario(decoded.role);
      } catch (e) {
        console.error("Error al decodificar el token", e);
      }
    }
  }, [token]);

  const fetchServicios = async () => {
    try {
      const res = await fetch(`${API_URL}/servicios/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setServicios(data.data || []);
      } else {
        throw new Error(data.message || 'Error al obtener servicios');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchServicios();
  }, []);

  const handleChange = (id, field, value) => {
    setServicios(prev =>
      prev.map(s => (s.ID === id ? { ...s, [field]: value } : s))
    );
  };

  const handleGuardar = async (servicio) => {
    console.log("Guardando servicio con ID:", servicio.ID); 
    try {
      const res = await fetch(`${API_URL}/servicios/${servicio.ID}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(servicio)
      });
      const data = await res.json();
      if (res.ok) {
        setMensaje('Servicio actualizado correctamente');
        fetchServicios();
      } else {
        throw new Error(data.message || 'Error al guardar');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEliminar = async (id) => {
    try {
      const res = await fetch(`${API_URL}/servicios/${id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setMensaje('Servicio eliminado correctamente');
        fetchServicios();
      } else {
        throw new Error(data.message || 'Error al eliminar');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAgregar = async () => {
    const servicioAEnviar = {
      nombre: nuevoServicio.nombre,
      descripcion: nuevoServicio.descripcion,
      precio: parseFloat(nuevoServicio.precio),
      duracion_estimada: parseInt(nuevoServicio.duracion_estimada)
    };

    try {
      const res = await fetch(`${API_URL}/servicios/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(servicioAEnviar)
      });
      const data = await res.json();
      if (res.ok) {
        setMensaje('Servicio agregado correctamente');
        setNuevoServicio({ nombre: '', descripcion: '', precio: '', duracion_estimada: '' });
        fetchServicios();
      } else {
        throw new Error(data.message || 'Error al agregar');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="servicios-container">
      <h2>ABM de Servicios</h2>

      {error && (
        <div className="banner-error">
          ⚠️ {error}
        </div>
      )}
      {mensaje && <p className="mensaje-exito">{mensaje}</p>}

      {['ADMIN', 'ADMINISTRADOR', 'admin'].includes(rolUsuario?.toUpperCase()) && (
        <div className="form-group">
          <input
            type="text"
            placeholder="Nombre"
            value={nuevoServicio.nombre}
            onChange={(e) => setNuevoServicio({ ...nuevoServicio, nombre: e.target.value })}
          />
          <input
            type="text"
            placeholder="Descripción"
            value={nuevoServicio.descripcion}
            onChange={(e) => setNuevoServicio({ ...nuevoServicio, descripcion: e.target.value })}
          />
          <input
            type="number"
            placeholder="Precio"
            value={nuevoServicio.precio}
            onChange={(e) => setNuevoServicio({ ...nuevoServicio, precio: e.target.value })}
          />
          <input
            type="number"
            placeholder="Duración estimada (minutos)"
            value={nuevoServicio.duracion_estimada}
            onChange={(e) => setNuevoServicio({ ...nuevoServicio, duracion_estimada: e.target.value })}
          />
          <button className="btn-agregar" onClick={handleAgregar}>Agregar</button>
        </div>
      )}

      <table className="servicios-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Duración</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {servicios.map((servicio) => (
            <tr key={servicio.ID}>
              <td>
                <input
                  type="text"
                  value={servicio.nombre}
                  onChange={(e) => handleChange(servicio.ID, 'nombre', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={servicio.descripcion}
                  onChange={(e) => handleChange(servicio.ID, 'descripcion', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={servicio.precio}
                  onChange={(e) => handleChange(servicio.ID, 'precio', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={servicio.duracion_estimada}
                  onChange={(e) => handleChange(servicio.ID, 'duracion_estimada', e.target.value)}
                />
              </td>
              <td>
                <button className="btn-guardar" onClick={() => handleGuardar(servicio)}>Guardar</button>
                <button className="btn-eliminar" onClick={() => handleEliminar(servicio.ID)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiciosPage;
