import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/PedirTurnoPage.scss';
import { jwtDecode } from 'jwt-decode';

const API_URL = process.env.REACT_APP_API_URL;

const PedirTurnoPage = () => {
  const [servicios, setServicios] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [fechas, setFechas] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [turnosOcupados, setTurnosOcupados] = useState([]);

  const [turno, setTurno] = useState({ servicio: '', empleado: '', fecha: '', hora: '' });
  const [mensajeFinal, setMensajeFinal] = useState('');
  const [monto, setMonto] = useState(null);
  const [resumen, setResumen] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

  useEffect(() => {
    fetchServicios();
    fetchEmpleados();
    generarFechasValidas();
    generarHorarios();
  }, []);

  const fetchServicios = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/servicios/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    console.log('Servicios recibidos:', data);
    setServicios(data.data || []);
  };

  const fetchEmpleados = async () => {
    const res = await fetch(`${API_URL}/personas`);
    const data = await res.json();
    const filtrados = data.filter(p => p.tipo_persona === 'EMPLEADO' && p.tipo_empleado && p.tipo_empleado !== 'OTRO');
    setEmpleados(filtrados);
  };

  const generarFechasValidas = () => {
    const hoy = new Date();
    const fechasValidas = [];
    for (let i = 1; i <= 14; i++) {
      const dia = new Date(hoy);
      dia.setDate(hoy.getDate() + i);
      const diaSemana = dia.getDay();
      if (diaSemana >= 2 && diaSemana <= 6) fechasValidas.push(dia);
    }
    setFechas(fechasValidas);
  };

  const generarHorarios = () => {
    const lista = [];
    for (let h = 9; h < 21; h++) {
      lista.push(`${h.toString().padStart(2, '0')}:00`);
      lista.push(`${h.toString().padStart(2, '0')}:30`);
    }
    setHorarios(lista);
  };

  const obtenerOcupados = async (empleadoId, fechaISO) => {
    try {
      const fecha = fechaISO.split('T')[0];
      const res = await fetch(`${API_URL}/turnos/disponibilidad/${empleadoId}/${fecha}`);
      const data = await res.json();

      const disponibles = (Array.isArray(data) ? data : data.data || []).map(d => d.split(' ')[1]);
      const ocupados = horarios.filter(h => !disponibles.includes(h));
      setTurnosOcupados(ocupados);
    } catch (err) {
      console.error('Error al obtener disponibilidad:', err);
      setTurnosOcupados([]);
    }
  };

  useEffect(() => {
    if (turno.empleado && turno.fecha && fechaSeleccionada) {
      obtenerOcupados(turno.empleado, fechaSeleccionada.toISOString());
    }
  }, [turno.empleado, turno.fecha]);

  const handleConfirmar = async () => {
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const id_cliente = decoded.id || decoded.persona_id;

    const payload = {
      id_cliente: id_cliente,
      id_empleado: parseInt(turno.empleado),
      id_servicio: parseInt(turno.servicio),
      fecha: turno.fecha,
      hora: turno.hora
    };

    try {
      const res = await fetch(`${API_URL}/turnos/reservar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        const servicioSeleccionado = servicios.find(s => s.id === parseInt(turno.servicio));
        const empleadoSeleccionado = empleados.find(e => e.id === parseInt(turno.empleado));
        setMonto(servicioSeleccionado?.precio || null);
        setResumen({
          servicio: servicioSeleccionado?.nombre,
          empleado: `${empleadoSeleccionado?.nombre} ${empleadoSeleccionado?.apellido}`,
          fecha: turno.fecha,
          hora: turno.hora
        });
        setMensajeFinal('¡Turno reservado exitosamente!');
      } else {
        alert('Error al reservar turno: ' + data.message);
      }
    } catch (err) {
      console.error('Error al confirmar turno:', err);
      alert('Error en la conexión al servidor');
    }
  };

  return (
    <div className="pedir-turno-container">
      <h2>Reservar un Turno</h2>

      {!mensajeFinal && (
        <div className="formulario-turno">
          <div className="bloque">
            <label>Servicio:</label>
            <select value={turno.servicio} onChange={e => setTurno({ ...turno, servicio: e.target.value })}>
              <option value="">Seleccione un servicio</option>
              {servicios.map(s => (
                <option key={s.id} value={s.id}>{s.nombre}</option>
              ))}
            </select>

            <label>Empleado:</label>
            <select value={turno.empleado} onChange={e => setTurno({ ...turno, empleado: e.target.value })}>
              <option value="">Seleccione un empleado</option>
              {empleados.map(e => (
                <option key={e.id} value={e.id}>{e.nombre} {e.apellido}</option>
              ))}
            </select>

            <label>Fecha:</label>
            <DatePicker
              selected={fechaSeleccionada}
              onChange={(date) => {
                setFechaSeleccionada(date);
                setTurno({ ...turno, fecha: date.toISOString().split('T')[0] });
              }}
              dateFormat="yyyy-MM-dd"
              includeDates={fechas}
              placeholderText="Seleccione una fecha"
              className="date-picker"
            />

            <label>Hora:</label>
            <select value={turno.hora} onChange={e => setTurno({ ...turno, hora: e.target.value })}>
              <option value="">Seleccione una hora</option>
              {horarios.map(h => (
                <option
                  key={h}
                  value={h}
                  className={turnosOcupados.includes(h) ? 'hora-ocupada' : 'hora-disponible'}
                  disabled={turnosOcupados.includes(h)}
                >
                  {h}
                </option>
              ))}
            </select>
          </div>

          <div className="bloque confirmacion">
            <button onClick={handleConfirmar} disabled={!turno.servicio || !turno.empleado || !turno.fecha || !turno.hora}>
              Confirmar Turno
            </button>
          </div>
        </div>
      )}

      {mensajeFinal && resumen && (
        <div className="bloque resumen-turno">
          <h3>{mensajeFinal}</h3>
          <div className="tarjeta-turno">
            <p><strong>Servicio:</strong> {resumen.servicio}</p>
            <p><strong>Empleado:</strong> {resumen.empleado}</p>
            <p><strong>Fecha:</strong> {resumen.fecha}</p>
            <p><strong>Hora:</strong> {resumen.hora}</p>
            {monto && <p><strong>Total a pagar:</strong> ${monto}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default PedirTurnoPage;
