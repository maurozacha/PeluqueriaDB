import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
  Spinner,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  fetchTurnoById,
  createTurno,
  updateTurno,
  fetchDisponibilidad,
  clearTurnoState
} from '../../shared/reducers/entities/turno.reducer';
import {
  fetchServicios,
  fetchEmpleadosByServicio
} from '../../shared/reducers/entities/servicio.reducer';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

const TurnoNewEditComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { turnoId } = useParams();
  const isEditMode = Boolean(turnoId);
  const { turnoActual, loading, error } = useSelector((state) => state.turno);
  const { servicios, loading: loadingServicios } = useSelector((state) => state.servicio);
  const { empleadosByServicio, loading: loadingEmpleados } = useSelector((state) => state.servicio);

  const [formData, setFormData] = useState({
    servicio_id: '',
    empleado_id: '',
    fecha_hora: new Date(),
    duracion: 30,
    notas: ''
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    dispatch(clearTurnoState());
    dispatch(fetchServicios());

    if (isEditMode) {
      dispatch(fetchTurnoById(turnoId));
    }
  }, [dispatch, turnoId, isEditMode]);

  useEffect(() => {
    if (isEditMode && turnoActual) {
      setFormData({
        servicio_id: turnoActual.servicio_id,
        empleado_id: turnoActual.empleado_id,
        fecha_hora: new Date(turnoActual.fecha_hora),
        duracion: turnoActual.duracion,
        notas: turnoActual.notas || ''
      });

      if (turnoActual.servicio_id) {
        dispatch(fetchEmpleadosByServicio(turnoActual.servicio_id));
      }
    }
  }, [turnoActual, isEditMode, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }

    if (name === 'servicio_id') {
      dispatch(fetchEmpleadosByServicio(value));
      setFormData(prev => ({
        ...prev,
        empleado_id: ''
      }));
    }
  };

  const handleDateTimeChange = (date) => {
    setFormData(prev => ({
      ...prev,
      fecha_hora: date
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.servicio_id) errors.servicio_id = 'Seleccione un servicio';
    if (!formData.empleado_id) errors.empleado_id = 'Seleccione un empleado';
    if (!formData.fecha_hora) errors.fecha_hora = 'Seleccione fecha y hora';
    if (formData.duracion <= 0) errors.duracion = 'Duración debe ser mayor a 0';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setShowConfirmModal(true);
  };

  const confirmSubmit = async () => {
    setShowConfirmModal(false);
    
    const turnoData = {
      servicio_id: parseInt(formData.servicio_id),
      empleado_id: parseInt(formData.empleado_id),
      fecha_hora: formData.fecha_hora.toISOString(),
      duracion: parseInt(formData.duracion),
      notas: formData.notas
    };

    try {
      if (isEditMode) {
        await dispatch(updateTurno({ turnoId, turnoData })).unwrap();
        toast.success('Turno actualizado con éxito');
      } else {
        await dispatch(createTurno(turnoData)).unwrap();
        toast.success('Turno creado con éxito');
      }
      navigate('/turnos');
    } catch (error) {
      toast.error(error.message || 'Error al guardar el turno');
    }
  };

  const checkDisponibilidad = async () => {
    if (!formData.empleado_id || !formData.servicio_id || !formData.fecha_hora) {
      toast.warn('Complete empleado, servicio y fecha/hora para ver disponibilidad');
      return;
    }

    try {
      await dispatch(fetchDisponibilidad({
        empleadoId: formData.empleado_id,
        servicioId: formData.servicio_id
      })).unwrap();
      toast.success('Disponibilidad verificada');
    } catch (error) {
      toast.error(error.message || 'Error al verificar disponibilidad');
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="text-center">
        <Spinner color="primary" />
        <p>Cargando turno...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>{isEditMode ? 'Editar Turno' : 'Nuevo Turno'}</h2>
      
      {error && <Alert color="danger">{error}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="servicio_id">Servicio *</Label>
              <Input
                type="select"
                name="servicio_id"
                id="servicio_id"
                value={formData.servicio_id}
                onChange={handleChange}
                disabled={loadingServicios}
                invalid={!!validationErrors.servicio_id}
              >
                <option value="">Seleccione un servicio</option>
                {servicios.map(servicio => (
                  <option key={servicio.id} value={servicio.id}>
                    {servicio.nombre} ({servicio.duracion_estimada} min)
                  </option>
                ))}
              </Input>
              {validationErrors.servicio_id && (
                <div className="invalid-feedback d-block">
                  {validationErrors.servicio_id}
                </div>
              )}
            </FormGroup>
          </Col>
          
          <Col md={6}>
            <FormGroup>
              <Label for="empleado_id">Empleado *</Label>
              <Input
                type="select"
                name="empleado_id"
                id="empleado_id"
                value={formData.empleado_id}
                onChange={handleChange}
                disabled={!formData.servicio_id || loadingEmpleados}
                invalid={!!validationErrors.empleado_id}
              >
                <option value="">Seleccione un empleado</option>
                {empleadosByServicio.map(empleado => (
                  <option key={empleado.id} value={empleado.id}>
                    {empleado.nombre} {empleado.apellido}
                  </option>
                ))}
              </Input>
              {validationErrors.empleado_id && (
                <div className="invalid-feedback d-block">
                  {validationErrors.empleado_id}
                </div>
              )}
            </FormGroup>
          </Col>
        </Row>
        
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="fecha_hora">Fecha y Hora *</Label>
              <div>
                <DateTimePicker
                  id="fecha_hora"
                  onChange={handleDateTimeChange}
                  value={formData.fecha_hora}
                  minDate={new Date()}
                  format="yyyy-MM-dd HH:mm"
                  disableClock={true}
                  className={`form-control ${validationErrors.fecha_hora ? 'is-invalid' : ''}`}
                />
              </div>
              {validationErrors.fecha_hora && (
                <div className="invalid-feedback d-block">
                  {validationErrors.fecha_hora}
                </div>
              )}
            </FormGroup>
          </Col>
          
          <Col md={6}>
            <FormGroup>
              <Label for="duracion">Duración (minutos) *</Label>
              <Input
                type="number"
                name="duracion"
                id="duracion"
                value={formData.duracion}
                onChange={handleChange}
                min="1"
                invalid={!!validationErrors.duracion}
              />
              {validationErrors.duracion && (
                <div className="invalid-feedback d-block">
                  {validationErrors.duracion}
                </div>
              )}
            </FormGroup>
          </Col>
        </Row>
        
        <FormGroup>
          <Label for="notas">Notas</Label>
          <Input
            type="textarea"
            name="notas"
            id="notas"
            value={formData.notas}
            onChange={handleChange}
            rows={3}
          />
        </FormGroup>
        
        <div className="d-flex justify-content-between mt-4">
          <Button
            color="secondary"
            onClick={() => navigate('/turnos')}
            disabled={loading}
          >
            Cancelar
          </Button>
          
          <div>
            <Button
              color="info"
              className="me-2"
              onClick={checkDisponibilidad}
              disabled={!formData.empleado_id || !formData.servicio_id || loading}
            >
              Ver Disponibilidad
            </Button>
            
            <Button
              color="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : 'Guardar'}
            </Button>
          </div>
        </div>
      </Form>
      
      <Modal isOpen={showConfirmModal} toggle={() => setShowConfirmModal(false)}>
        <ModalHeader toggle={() => setShowConfirmModal(false)}>
          Confirmar {isEditMode ? 'Actualización' : 'Creación'} de Turno
        </ModalHeader>
        <ModalBody>
          ¿Está seguro que desea {isEditMode ? 'actualizar' : 'crear'} este turno?
          <div className="mt-3">
            <strong>Detalles:</strong>
            <ul>
              <li>Servicio: {servicios.find(s => s.id === parseInt(formData.servicio_id))?.nombre || '-'}</li>
              <li>Empleado: {
                empleadosByServicio.find(e => e.id === parseInt(formData.empleado_id)) 
                ? `${empleadosByServicio.find(e => e.id === parseInt(formData.empleado_id)).nombre} ${empleadosByServicio.find(e => e.id === parseInt(formData.empleado_id)).apellido}`
                : '-'
              }</li>
              <li>Fecha y Hora: {formData.fecha_hora.toLocaleString()}</li>
              <li>Duración: {formData.duracion} minutos</li>
            </ul>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancelar
          </Button>
          <Button color="primary" onClick={confirmSubmit}>
            Confirmar
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default TurnoNewEditComponent;