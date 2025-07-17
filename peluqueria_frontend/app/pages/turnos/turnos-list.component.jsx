import React, { useEffect } from "react";
import { Table, Spinner, Alert, Button } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchTurnosByCliente,
  clearTurnoState,
  cancelarReserva
} from "../../shared/reducers/entities/turno.reducer";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const TurnosListComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const handleVerDetallePago = (turno) => {
    if (!turno?.pago?.ID) {
      toast.warning("No hay información de pago disponible para este turno");
      return;
    }
    
    const pagoData = {
      id: turno.pago.ID,
      monto: turno.pago.MONTO || 0,
      fecha_pago: turno.pago.FECHA_PAGO || null,
      estado_id: turno.pago.ESTADO_ID || 1,
      metodo_id: turno.pago.METODO_ID || 2,
      comprobante: turno.pago.COMPROBANTE || "No disponible",
      servicio: {
        nombre: turno.servicio?.nombre || "No disponible",
        descripcion: turno.servicio?.descripcion || "No disponible",
        precio: turno.servicio?.precio || 0
      },
      turno: {
        fecha_hora: turno.fecha_hora || new Date().toISOString(),
        duracion: turno.duracion || 0,
        estado: turno.estado || "PENDIENTE"
      },
      cliente: userData || {
        nombre: "No disponible",
        apellido: "",
        email: "No disponible",
        persona_id: 0
      },
      empleado: turno.empleado || {
        nombre: "No disponible",
        apellido: "",
        tipo_empleado: "No disponible"
      }
    };

    navigate(`/pagos/${turno?.pago?.ID}`, {
      state: { pagoData }
    });
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
                  <td>{turno.fecha_hora ? new Date(turno.fecha_hora).toLocaleString() : "No disponible"}</td>
                  <td>{turno.duracion || 0} min</td>
                  <td>{turno.servicio?.nombre || "-"}</td>
                  <td>
                    {turno.empleado ? 
                      `${turno.empleado.nombre || ""} ${turno.empleado.apellido || ""}`.trim() || "-" 
                      : "-"}
                  </td>
                  <td>{turno.estado || "PENDIENTE"}</td>
                  <td>
                    <div className="d-flex gap-2">
                      {turno.pago?.ID && (
                        <Button 
                          color="primary" 
                          size="sm"
                          onClick={() => handleVerDetallePago(turno)}
                        >
                          Detalle Pago
                        </Button>
                      )}
                      {cancelingId === turno.id ? (
                        <Spinner color="danger" size="sm" />
                      ) : (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCancelarTurno(turno.id)}
                          disabled={turno.estado !== "PENDIENTE" || loading}
                        >
                          Cancelar Turno
                        </button>
                      )}
                    </div>
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