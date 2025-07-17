import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Spinner,
  Alert,
  FormGroup,
  Label,
  Input,
  Container,
  Row,
  Col,
  Form,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCheck } from "@fortawesome/free-solid-svg-icons";
import {
  fetchEmpleadosByServicio,
  fetchServicioById,
} from "../../shared/reducers/entities/servicio.reducer";
import {
  fetchDisponibilidad,
  crearReserva,
} from "../../shared/reducers/entities/turno.reducer";
import { fetchMetodosPago } from "../../shared/reducers/entities/pago.reducer";
import ModalPago from "../pagos/pago-modal.component";
import "../../shared/styles/turno.scss";

const ReservarTurnoComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const servicioId = queryParams.get("servicio");
  const locationState = location.state || {};

  const { empleadosPorServicio, loading, error } = useSelector(
    (state) => state.servicio
  );
  const {
    turnosDisponibles,
    loading: loadingTurnos,
    error: errorTurnos,
  } = useSelector((state) => state.turno);
  const { metodosPago } = useSelector((state) => state.pago);
  const { token, user } = useSelector((state) => state.auth);

  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [modalPago, setModalPago] = useState(false);
  const [metodoPago, setMetodoPago] = useState(null);
  const [notasPago, setNotasPago] = useState("");
  const servicioInfo = useSelector((state) => state.servicio.servicioInfo);

  useEffect(() => {
    if (servicioId && token) {
      dispatch(fetchServicioById(Number(servicioId)));
      dispatch(fetchEmpleadosByServicio(servicioId));
      dispatch(fetchMetodosPago());
    }
  }, [servicioId, dispatch, token]);

  useEffect(() => {
    setTurnoSeleccionado(null);
  }, [empleadoSeleccionado]);

  useEffect(() => {
    if (empleadoSeleccionado && servicioId) {
      dispatch(
        fetchDisponibilidad({
          empleadoId: Number(empleadoSeleccionado),
          servicioId: Number(servicioId),
        })
      );
    }
  }, [empleadoSeleccionado, servicioId, dispatch]);

  const handleEmpleadoChange = useCallback((e) => {
    setEmpleadoSeleccionado(e.target.value);
    setTurnoSeleccionado(null);
  }, []);

  const handleReservar = useCallback(() => {
    if (!turnoSeleccionado || !user) return;

    const reservaData = {
      turnoId: turnoSeleccionado.id,
      clienteId: user.persona_id,
    };

    dispatch(crearReserva(reservaData))
      .then((res) => {
        if (res.payload?.success) {
          setTurnoSeleccionado(res.payload.turno);

          dispatch(
            fetchDisponibilidad({
              empleadoId: Number(empleadoSeleccionado),
              servicioId: Number(servicioId),
            })
          ).then(() => {
            setModalPago(true);
          });
        }
      })
      .catch((error) => {
        console.error("Error al reservar turno:", error);
      });
  }, [turnoSeleccionado, user, empleadoSeleccionado, servicioId, dispatch]);

  console.log("SERVICIO INFO = ", metodosPago);
  const handleConfirmarPago = useCallback(
    ({ metodoPagoId, notas }) => {
      if (!metodoPagoId || !turnoSeleccionado?.id) return;

      const pagoData = {
        turnoId: turnoSeleccionado.id,
        metodoPagoId: metodoPagoId,
        monto: servicioInfo?.precio || 0,
        notas: notas,
      };

      dispatch(procesarPago(pagoData)).then((res) => {
        if (res.payload?.success) {
          navigate("/mis-turnos");
        }
      });
    },
    [turnoSeleccionado, servicioInfo, dispatch, navigate]
  );

  const formatFecha = (fechaStr) => {
    const [year, month, day] = fechaStr.split("-");
    const meses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    return `Fecha: ${day} de ${meses[parseInt(month) - 1]} del ${year}`;
  };

  const renderTurnosDisponibles = () => {
    if (!empleadoSeleccionado) return null;

    const turnosRealmenteDisponibles = turnosDisponibles?.filter(
      (turno) => turno.estado === "DISPONIBLE"
    );

    if (loadingTurnos) {
      return (
        <div className="text-center my-4">
          <Spinner color="primary" />
          <p className="mt-2 text-white">Buscando turnos disponibles...</p>
        </div>
      );
    }

    return (
      <div className="turnos-disponibles mt-4">
        <h4 className="text-center text-white mb-4">Turnos Disponibles</h4>
        {turnosDisponibles?.length ? (
          <Row className="g-3 justify-content-center">
            {turnosDisponibles.map((turno) => (
              <Col key={turno.id} sm="6" md="6" lg="6" xl="6">
                <Card
                  className={`turno-card ${turnoSeleccionado?.id === turno.id ? "selected bg-success text-white" : ""}`}
                  onClick={() => setTurnoSeleccionado(turno)}
                >
                  <CardBody className="text-center position-relative">
                    {turnoSeleccionado?.id === turno.id && (
                      <div className="position-absolute top-0 end-0 m-2">
                        <FontAwesomeIcon icon={faCheck} size="lg" />
                      </div>
                    )}
                    <div className="fw-bold">{formatFecha(turno.fecha)}</div>
                    <div>Horario: {turno.hora}</div>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Alert color="warning" className="mt-3">
            No hay turnos disponibles para este empleado
          </Alert>
        )}
      </div>
    );
  };

  const handleVolver = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const renderLoading = () => (
    <div className="text-center my-4">
      <Spinner color="primary" />
      <p className="mt-2 text-white">Cargando información...</p>
    </div>
  );

  const renderError = () => (
    <Alert color="danger" className="mt-3">
      Error: {error}
    </Alert>
  );

  return (
    <Container className="reserva-turno-container py-4">
      <Button color="secondary" onClick={handleVolver} className="mb-3">
        <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
        Volver
      </Button>

      <h2 className="text-center text-white mb-4">Reservar Turno</h2>

      {loading && renderLoading()}
      {error && renderError()}

      <Row className="justify-content-center">
        <Col md="6" lg="5" xl="4">
          <FormGroup>
            <Label for="empleadoSelect" className="text-white">
              Seleccionar Empleado
            </Label>
            <Input
              type="select"
              id="empleadoSelect"
              onChange={handleEmpleadoChange}
              disabled={loading}
              value={empleadoSeleccionado || ""}
            >
              <option value="">-- Seleccione un empleado --</option>
              {empleadosPorServicio.map((empleado) => (
                <option key={empleado.id} value={empleado.id}>
                  {empleado.nombre} {empleado.apellido}
                </option>
              ))}
            </Input>
          </FormGroup>
        </Col>
      </Row>

      {renderTurnosDisponibles()}

      {turnoSeleccionado && (
        <div className="text-center mt-4">
          <Button color="primary" onClick={handleReservar} className="px-4">
            Reservar
          </Button>
        </div>
      )}

      <ModalPago
        isOpen={modalPago}
        toggle={() => setModalPago(false)}
        metodosPago={metodosPago}
        monto={servicioInfo?.precio || 0}
        empleado={empleadosPorServicio.find(
          (e) => e.id === Number(empleadoSeleccionado)
        )}
        servicio={servicioInfo}
        onConfirmarPago={handleConfirmarPago}
        initialMetodoPago={metodoPago}
        initialNotasPago={notasPago}
      />
    </Container>
  );
};

export default ReservarTurnoComponent;
