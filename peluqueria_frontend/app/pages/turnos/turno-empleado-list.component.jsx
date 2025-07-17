import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Spinner,
  Alert,
  Button,
  Row,
  Col,
  Input,
  FormGroup,
  Label,
  Card,
  CardBody,
  CardHeader,
  Badge
} from 'reactstrap';
import { fetchTurnos, clearTurnoState } from '../../shared/reducers/entities/turno.reducer';
import { fetchServicios } from '../../shared/reducers/entities/servicio.reducer';
import { fetchEmpleados } from '../../shared/reducers/entities/empleado.reducer';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const TurnoEmpleadoListComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { turnos, loading, error } = useSelector((state) => state.turno);
  const { servicios } = useSelector((state) => state.servicio);
  const { empleados } = useSelector((state) => state.empleado);
  
  const [filters, setFilters] = useState({
    empleado_id: '',
    servicio_id: '',
    fecha: '',
    estado: ''
  });

  useEffect(() => {
    dispatch(clearTurnoState());
    dispatch(fetchServicios());
    dispatch(fetchEmpleados());
    dispatch(fetchTurnos());
  }, [dispatch]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    const queryParams = {};
    
    if (filters.empleado_id) queryParams.empleado_id = filters.empleado_id;
    if (filters.servicio_id) queryParams.servicio_id = filters.servicio_id;
    if (filters.fecha) queryParams.fecha = filters.fecha;
    if (filters.estado) queryParams.estado = filters.estado;
    
    dispatch(fetchTurnos(queryParams));
  };

  const clearFilters = () => {
    setFilters({
      empleado_id: '',
      servicio_id: '',
      fecha: '',
      estado: ''
    });
    dispatch(fetchTurnos());
  };

  const handleEdit = (turnoId) => {
    navigate(`/turnos/edit/${turnoId}`);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return format(date, "PPPpp", { locale: es });
  };

  const getEstadoBadgeColor = (estado) => {
    switch (estado) {
      case 'PENDIENTE': return 'warning';
      case 'CONFIRMADO': return 'success';
      case 'CANCELADO': return 'danger';
      case 'COMPLETADO': return 'info';
      default: return 'secondary';
    }
  };

  return (
    <div className="container mt-4">
      <h2>Listado de Turnos</h2>
      
      <Card className="mb-4">
        <CardHeader>Filtros</CardHeader>
        <CardBody>
          <Row>
            <Col md={3}>
              <FormGroup>
                <Label for="empleado_id">Empleado</Label>
                <Input
                  type="select"
                  name="empleado_id"
                  id="empleado_id"
                  value={filters.empleado_id}
                  onChange={handleFilterChange}
                >
                  <option value="">Todos</option>
                  {empleados.map(empleado => (
                    <option key={empleado.id} value={empleado.id}>
                      {empleado.nombre} {empleado.apellido}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            
            <Col md={3}>
              <FormGroup>
                <Label for="servicio_id">Servicio</Label>
                <Input
                  type="select"
                  name="servicio_id"
                  id="servicio_id"
                  value={filters.servicio_id}
                  onChange={handleFilterChange}
                >
                  <option value="">Todos</option>
                  {servicios.map(servicio => (
                    <option key={servicio.id} value={servicio.id}>
                      {servicio.nombre}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            
            <Col md={3}>
              <FormGroup>
                <Label for="fecha">Fecha</Label>
                <Input
                  type="date"
                  name="fecha"
                  id="fecha"
                  value={filters.fecha}
                  onChange={handleFilterChange}
                />
              </FormGroup>
            </Col>
            
            <Col md={3}>
              <FormGroup>
                <Label for="estado">Estado</Label>
                <Input
                  type="select"
                  name="estado"
                  id="estado"
                  value={filters.estado}
                  onChange={handleFilterChange}
                >
                  <option value="">Todos</option>
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="CONFIRMADO">Confirmado</option>
                  <option value="CANCELADO">Cancelado</option>
                  <option value="COMPLETADO">Completado</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>
          
          <div className="d-flex justify-content-end">
            <Button color="secondary" onClick={clearFilters} className="me-2">
              Limpiar
            </Button>
            <Button color="primary" onClick={applyFilters}>
              Aplicar Filtros
            </Button>
          </div>
        </CardBody>
      </Card>
      
      <div className="d-flex justify-content-end mb-3">
        <Button color="success" onClick={() => navigate('/turnos/new')}>
          Nuevo Turno
        </Button>
      </div>
      
      {error && <Alert color="danger">{error}</Alert>}
      
      {loading ? (
        <div className="text-center">
          <Spinner color="primary" />
          <p>Cargando turnos...</p>
        </div>
      ) : (
        <Table striped hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha y Hora</th>
              <th>Duración</th>
              <th>Servicio</th>
              <th>Empleado</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {turnos?.length > 0 ? (
              turnos.map((turno) => (
                <tr key={turno.id}>
                  <td>{turno.id}</td>
                  <td>{formatDateTime(turno.fecha_hora)}</td>
                  <td>{turno.duracion} min</td>
                  <td>{turno.servicio?.nombre || '-'}</td>
                  <td>
                    {turno.empleado 
                      ? `${turno.empleado.nombre} ${turno.empleado.apellido}`
                      : '-'
                    }
                  </td>
                  <td>
                    <Badge color={getEstadoBadgeColor(turno.estado)}>
                      {turno.estado}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      color="primary"
                      size="sm"
                      onClick={() => handleEdit(turno.id)}
                      className="me-2"
                    >
                      Editar
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center text-muted">
                  No hay turnos registrados
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default TurnoEmpleadoListComponent;