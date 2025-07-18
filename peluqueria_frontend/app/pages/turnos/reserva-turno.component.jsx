import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
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
  cancelarReserva,
  procesarPago,
} from "../../shared/reducers/entities/turno.reducer";
import { fetchMetodosPago } from "../../shared/reducers/entities/pago.reducer";
import ModalPago from "../pagos/pago-modal.component";
import { formatFecha } from "../../constants/system-constants";
import "../../shared/styles/turno.scss";

const ReservarTurnoComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const servicioId = queryParams.get("servicio");

  const {
    empleadosPorServicio,
    loading: loadingServicio,
    error: errorServicio,
  } = useSelector((state) => state.servicio);
  const {
    turnosDisponibles,
    loading: loadingTurnos,
    error: errorTurnos,
  } = useSelector((state) => state.turno);
  const { metodosPago } = useSelector((state) => state.pago);
  const { token, user } = useSelector((state) => state.auth);
  const servicioInfo = useSelector((state) => state.servicio.servicioInfo);

  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [modalPago, setModalPago] = useState(false);
  const [metodoPago] = useState(null);
  const [notasPago] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [loadingPago, setLoadingPago] = useState(false);

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
  }, []);

  const handleReservar = useCallback(() => {
    if (!turnoSeleccionado || !user) return;

    const reservaData = {
      turnoId: turnoSeleccionado.id,
      clienteId: user.persona_id,
    };

    dispatch(crearReserva(reservaData))
      .unwrap()
      .then((payload) => {
        if (payload?.turno !== null && payload.turno.cliente_id !== null) {
          setTurnoSeleccionado(payload.turno);
          setModalPago(true);
          dispatch(
            fetchDisponibilidad({
              empleadoId: Number(empleadoSeleccionado),
              servicioId: Number(servicioId),
            })
          );
        }
      })
      .catch((error) => {
        console.error("Error al reservar turno:", error);
      });
  }, [turnoSeleccionado, user, empleadoSeleccionado, servicioId, dispatch]);

  const handleConfirmarPago = useCallback(
    async ({ metodoPagoId, notas }) => {
      if (!metodoPagoId || !turnoSeleccionado?.id) return;

      setLoadingPago(true);

      try {
        const pagoData = {
          turnoId: turnoSeleccionado.id,
          metodoPagoId: metodoPagoId,
          monto: servicioInfo?.precio || 0,
          notas: notas,
        };

        const res = await dispatch(procesarPago(pagoData)).unwrap();

        if (res?.comprobante !== null) {
          navigate(`/pagos/${res.id}`, {
            state: {
              pagoData: {
                ...res,
                turno: turnoSeleccionado,
                servicio: servicioInfo,
                cliente: user,
                empleado: empleadosPorServicio.find(
                  (e) => e.id === Number(empleadoSeleccionado)
                ),
              },
            },
          });
        }

        return res;
      } catch (error) {
        console.error("Error al procesar pago:", error);
        throw error;
      } finally {
        setLoadingPago(false);
      }
    },
    [
      turnoSeleccionado,
      servicioInfo,
      empleadoSeleccionado,
      user,
      dispatch,
      navigate,
    ]
  );

  const handleConfirmCancelReservation = () => {
    dispatch(cancelarReserva(turnoSeleccionado.id))
      .unwrap()
      .then(() => {
        dispatch(
          fetchDisponibilidad({
            empleadoId: Number(empleadoSeleccionado),
            servicioId: Number(servicioId),
          })
        );
        setTurnoSeleccionado(null);
        setShowCancelConfirm(false);
        setModalPago(false);
      })
      .catch((error) => {
        console.error("Error al cancelar reserva:", error);
        setShowCancelConfirm(false);
      });
  };

  const handleContinuePayment = () => {
    setShowCancelConfirm(false);
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
      Error: {errorServicio}
    </Alert>
  );

  const renderEmpleadoSelector = () => {
    if (loadingServicio || !empleadosPorServicio.length) return null;

    return (
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
    );
  };

  const renderTurnosDisponibles = () => {
    if (!empleadoSeleccionado || loadingTurnos) return null;

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

  const renderReservaButton = () => {
    if (!turnoSeleccionado) return null;

    return (
      <div className="text-center mt-4">
        <Button color="primary" onClick={handleReservar} className="px-4">
          Reservar
        </Button>
      </div>
    );
  };

  const isLoading = loadingServicio || !empleadosPorServicio.length;

  if (loadingPago) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
        <Spinner color="light" style={{ width: "3rem", height: "3rem" }} />
      </div>
    );
  }

  return (
    <Container className="reserva-turno-container py-4">
      
      <h2 className="text-center text-white mb-4">Reservar Turno</h2>

      {loadingServicio && renderLoading()}
      {errorServicio && renderError()}

      {!isLoading && (
        <>
          {renderEmpleadoSelector()}
          {renderTurnosDisponibles()}
          {renderReservaButton()}
        </>
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
        onClose={() => {
          setModalPago(false);
        }}
      />

      <Modal
        isOpen={showCancelConfirm}
        toggle={() => setShowCancelConfirm(false)}
      >
        <ModalHeader>Confirmar cancelación</ModalHeader>
        <ModalBody>
          ¿Estás seguro que deseas cancelar la reserva de este turno? Si
          cancelas, el turno volverá a estar disponible.
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={handleContinuePayment}>
            Volver al pago
          </Button>
          <Button color="danger" onClick={handleConfirmCancelReservation}>
            Sí, cancelar reserva
          </Button>
        </ModalFooter>
      </Modal>

      <Button color="secondary" onClick={handleVolver} className="mt-4">
        <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
        Volver
      </Button>
    </Container>
  );
};

export default ReservarTurnoComponent;
