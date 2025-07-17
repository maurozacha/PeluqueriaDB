import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardText,
  Button,
  Spinner,
  Alert,
} from "reactstrap";
import {
  fetchServicios,
  fetchServiciosByEmpleado,
  clearServicioState,
} from "../../shared/reducers/entities/servicio.reducer";
import "../../shared/styles/servicio.scss";
import corteImage from "../../shared/image/servicio-corte.png";
import tinturaImage from "../../shared/image/servicio-tintura.png";
import barberiaImage from "../../shared/image/servicio-barberia.png";

const ServicioListComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { servicios, serviciosPorEmpleado, loading, error, currentEmpleado } =
    useSelector((state) => state.servicio); 

  const { token, userData } = useSelector((state) => state.auth);

  const getServiceImage = (servicio) => {
    if (!servicio.tipo_servicio) return corteImage;

    switch (servicio.tipo_servicio.toUpperCase()) {
      case "CORTE":
        return corteImage;
      case "TINTURA":
        return tinturaImage;
      case "BARBERIA":
        return barberiaImage;
      default:
        return corteImage;
    }
  };

  useEffect(() => {
    dispatch(clearServicioState());
    if (token) {
      dispatch(fetchServicios());
    }
  }, [dispatch, token]);

  const handleSeleccionarEmpleado = (empleadoId) => {
    dispatch(fetchServiciosByEmpleado(empleadoId));
  };

  const handleReservarTurno = (empleadoId, servicio) => {
    navigate(`/reservar-turno?empleado=${empleadoId}&monto=${servicio.precio}&servicio=${servicio.ID}`);
  };

  return (
    <div className="servicios-page">
      <h2 className="text-center mb-4">Nuestros Servicios</h2>

      {loading && (
        <div className="text-center">
          <Spinner color="primary" />
          <p className="text-white">Cargando servicios...</p>
        </div>
      )}

      {error && (
        <Alert color="danger">Error al cargar servicios: {error}</Alert>
      )}

      <div className="servicios-section">
        <div className="servicios-grid">
          {servicios.map((servicio) => (
            <Card key={`general-${servicio.ID}`} className="servicio-card">
              <CardImg
                top
                width="100%"
                src={getServiceImage(servicio)}
                alt={servicio.nombre}
              />
              <CardBody>
                <CardTitle tag="h5">{servicio.nombre}</CardTitle>
                <CardText>
                  {servicio.descripcion || "Servicio profesional"}
                </CardText>
                <CardText>
                  <small className="text-white">
                    Duración: {servicio.duracion_estimada} min | $
                    {servicio.precio}
                  </small>
                </CardText>
                <Button
                  color="success"
                  onClick={() =>
                    navigate(`/reservar-turno?servicio=${servicio.ID}`)
                  }
                  className="mt-2"
                >
                  Reservar Turno
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicioListComponent;