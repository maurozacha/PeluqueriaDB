import React, { useEffect } from "react";
import { Table, Spinner, Alert } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTurnosByCliente,
  clearTurnoState,
  cancelarReserva
} from "../../shared/reducers/entities/turno.reducer";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const TurnosListComponent = () => {
  const dispatch = useDispatch();
  const { turnos, loading, error } = useSelector((state) => state.turno);
  const userData = useSelector((state) => state.auth.user);
  const [cancelingId, setCancelingId] = React.useState(null);

  useEffect(() => {
    dispatch(clearTurnoState());
    if (userData?.persona_id) {
      dispatch(fetchTurnosByCliente(userData.persona_id));
    }
  }, [dispatch, userData]);

  const handleCancelarTurno = async (turnoId) => {
    setCancelingId(turnoId);
    try {
      await dispatch(cancelarReserva(turnoId)).unwrap();
      toast.success("El turno fue cancelado con éxito");
      if (userData?.persona_id) {
        dispatch(fetchTurnosByCliente(userData.persona_id));
      }
    } catch (error) {
      toast.error("Hubo un problema al cancelar el turno");
    } finally {
      setCancelingId(null);
    }
  };

  return (
    <div className="turnos-page">
      <h2 className="text-center text-white mb-4">Mis Turnos</h2>

      {error && <Alert color="danger">Error al cargar turnos: {error}</Alert>}

      {loading && turnos.length === 0 ? (
        <div className="text-center">
          <Spinner color="primary" />
          <p className="text-white">Cargando turnos...</p>
        </div>
      ) : (
        <Table striped hover responsive className="text-black">
          <thead>
            <tr>
              <th>Fecha y Hora</th>
              <th>Duración</th>
              <th>Servicio</th>
              <th>Especialista</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {turnos?.length > 0 ? (
              turnos.map((turno) => (
                <tr key={turno.id}>
                  <td>{new Date(turno.fecha_hora).toLocaleString()}</td>
                  <td>{turno.duracion} min</td>
                  <td>{turno.servicio?.nombre || "-"}</td>
                  <td>{`${turno.empleado?.nombre || "-"} ${turno.empleado?.apellido || ""}`}</td>
                  <td>{turno.estado}</td>
                  <td>
                    {cancelingId === turno.id ? (
                      <Spinner size="sm" color="danger" />
                    ) : (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleCancelarTurno(turno.id)}
                        disabled={turno.estado !== "PENDIENTE" || loading}
                      >
                        Cancelar Turno
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No hay turnos asignados
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default TurnosListComponent;