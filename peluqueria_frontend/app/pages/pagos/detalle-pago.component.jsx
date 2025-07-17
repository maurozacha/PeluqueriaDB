import React, { useEffect, useState } from "react";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Container,
  Row,
  Spinner,
} from "reactstrap";
import { fetchClienteById } from "../../shared/reducers/entities/cliente.reducer";

import { formatFecha } from "../../constants/system-constants";

const DetallePago = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pagoId } = useParams();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { clienteActual, loading: loadingCliente } = useSelector(
    (state) => state.cliente
  );
  const { pagoData } = location.state;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        await dispatch(fetchClienteById(pagoData.cliente.persona_id));
      } catch (err) {
        setError(err.message || "Error al cargar los datos del pago");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dispatch, pagoId, location.state]);

  const handleVolver = () => {
    navigate("/servicios");
  };

  const evalueateEstado = () => {
    switch (pagoData?.estado_id) {
      case 1:
        return "PENDIENTE";
      case 2:
        return "APROBADO";
      case 3:
        return "RECHAZADO";
      case 4:
        return "REEMBOLSADO";
      case 5:
        return "CANCELADO";
      default:
        return "PENDIENTE";
    }
  };

  const evaluateMetodoPago = () => {
    switch (pagoData?.metodo_id) {
      case 1:
        return "MERCADO PAGO";
      case 2:
        return "EFECTIVO";
      default:
        return "EFECTIVO";
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner color="primary" />
        <p className="mt-2">Cargando información del pago...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert color="danger">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
          <div className="text-center mt-3">
            <Button color="danger" onClick={handleVolver}>
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Volver a servicios
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Card className="mb-4">
        <CardHeader className="bg-white border-bottom">
          <CardTitle tag="h3" className="mb-0 text-center">
            Detalle del Pago N° {pagoData?.id}
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md={6}>
              <h4 className="mb-3">Información del Servicio</h4>
              <div className="mb-3">
                <strong>Servicio:</strong>{" "}
                {pagoData?.servicio?.nombre || "No disponible"}
              </div>
              <div className="mb-3">
                <strong>Descripción:</strong>{" "}
                {pagoData?.servicio?.descripcion || "No disponible"}
              </div>
              <div className="mb-3">
                <strong>Precio:</strong> $
                {pagoData?.servicio?.precio?.toFixed(2) || "0.00"}
              </div>
            </Col>

            <Col md={6}>
              <h4 className="mb-3">Información del Turno</h4>
              <div className="mb-3">
                <strong>Fecha y Hora:</strong>{" "}
                {pagoData?.turno?.fecha_hora
                  ? formatFecha(pagoData?.turno?.fecha_hora)
                  : "No disponible"}
              </div>
              <div className="mb-3">
                <strong>Duración:</strong> {pagoData?.turno?.duracion || "0"}{" "}
                minutos
              </div>
              <div className="mb-3">
                <strong>Estado:</strong>{" "}
                <Badge
                  color={
                    pagoData?.turno?.estado === "CONFIRMADO"
                      ? "success"
                      : pagoData?.turno?.estado === "CANCELADO"
                        ? "danger"
                        : "warning"
                  }
                >
                  {pagoData?.turno?.estado || "No disponible"}
                </Badge>
              </div>
            </Col>
          </Row>

          <hr className="my-4" />

          <Row>
            <Col md={6}>
              <h4 className="mb-3">Información del Pago</h4>
              <div className="mb-3">
                <strong>Monto:</strong> ${pagoData?.monto}
              </div>
              <div className="mb-3">
                <strong>Fecha de Pago:</strong>{" "}
                {pagoData?.fecha_pago
                  ? new Date(pagoData.fecha_pago).toLocaleString()
                  : "No disponible"}
              </div>
              <div className="mb-3">
                <strong>Estado:</strong>{" "}
                <Badge
                  color={
                    pagoData?.estado_id === 1
                      ? "success"
                      : pagoData?.estado_id === 2
                        ? "danger"
                        : "warning"
                  }
                >
                  {evalueateEstado()}
                </Badge>
              </div>
              <div className="mb-3">
                <strong>Método de Pago:</strong> {evaluateMetodoPago()}
              </div>
              <div className="mb-3">
                <strong>N° Comprobante:</strong>{" "}
                {pagoData?.comprobante || "No disponible"}
              </div>
            </Col>

            <Col md={6}>
              <h4 className="mb-3">Información Personal</h4>
              <div className="mb-3">
                <strong>Cliente:</strong>{" "}
                {clienteActual
                  ? `${clienteActual.nombre} ${clienteActual.apellido}`
                  : "No disponible"}
              </div>
              <div className="mb-3">
                <strong>Email:</strong>{" "}
                {clienteActual?.email || "No disponible"}
              </div>
              <div className="mb-3">
                <strong>Empleado:</strong>{" "}
                {pagoData?.empleado
                  ? `${pagoData?.empleado?.nombre} ${pagoData?.empleado?.apellido}`
                  : "No disponible"}
              </div>
              <div className="mb-3">
                <strong>Especialidad:</strong>{" "}
                {pagoData?.empleado?.tipo_empleado || "No disponible"}
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <div className="text-center">
        <Button color="secondary" onClick={handleVolver}>
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Volver a servicios
        </Button>
      </div>
    </Container>
  );
};

export default DetallePago;
