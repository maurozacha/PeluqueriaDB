import React, { useEffect, useState } from 'react';
import '../styles/PersonasPage.scss';

const API_URL = process.env.REACT_APP_API_URL;

const PersonasPage = () => {
  const [personas, setPersonas] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPersonas();
  }, []);

  const fetchPersonas = async () => {
    try {
      const res = await fetch(`${API_URL}/personas`);
      const data = await res.json();
      setPersonas(data);
    } catch (error) {
      console.error('Error al obtener personas:', error);
    }
  };

  const handleCambio = async (id, campo, valor) => {
    try {
      const persona = personas.find(p => p.id === id);
      const actualizada = { ...persona, [campo]: valor };

      const res = await fetch(`${API_URL}/personas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actualizada)
      });

      if (res.ok) {
        setMensaje('Persona actualizada correctamente');
        fetchPersonas();
      } else {
        setError('Error al actualizar persona');
      }
    } catch (e) {
      console.error('Error:', e);
      setError('Error inesperado');
    }
  };

  return (
    <div className="personas-container">
      <h2>Gestión de Personas</h2>

      {mensaje && <p className="mensaje">{mensaje}</p>}
      {error && <p className="error">{error}</p>}

      <div className="tabla-container">
        <table className="tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>DNI</th>
              <th>Email</th>
              <th>Tipo Persona</th>
              <th>Tipo Empleado</th>
            </tr>
          </thead>
          <tbody>
            {personas.map(p => (
              <tr key={p.id}>
                <td>
                  <input
                    value={p.nombre}
                    onChange={(e) => handleCambio(p.id, 'nombre', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    value={p.apellido}
                    onChange={(e) => handleCambio(p.id, 'apellido', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    value={p.dni}
                    onChange={(e) => handleCambio(p.id, 'dni', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    value={p.email}
                    onChange={(e) => handleCambio(p.id, 'email', e.target.value)}
                  />
                </td>
                <td>
                  <select
                    value={p.tipo_persona}
                    onChange={(e) => handleCambio(p.id, 'tipo_persona', e.target.value)}
                  >
                    <option value="CLIENTE">CLIENTE</option>
                    <option value="EMPLEADO">EMPLEADO</option>
                    <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                  </select>
                </td>
                <td>
                  {p.tipo_persona === 'EMPLEADO' ? (
                    <select
                      value={p.tipo_empleado || ''}
                      onChange={(e) => handleCambio(p.id, 'tipo_empleado', e.target.value)}
                    >
                      <option value="">Seleccionar</option>
                      <option value="PELUQUERO">PELUQUERO</option>
                      <option value="BARBERO">BARBERO</option>
                      <option value="ASISTENTE">ASISTENTE</option>
                      <option value="OTRO">OTRO</option>
                    </select>
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PersonasPage;
