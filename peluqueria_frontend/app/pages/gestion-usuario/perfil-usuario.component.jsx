import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner,
  Alert,
  Table,
  Badge,
  Row,
  Col
} from 'reactstrap';
import { clearClienteState,fetchClienteById, updateCliente } from '../../shared/reducers/entities/cliente.reducer';
import { clearEmpleadoState ,fetchEmpleadoById, updateEmpleado} from '../../shared/reducers/entities/empleado.reducer';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PerfilUsuarioComponent = () => {
  const dispatch = useDispatch();
  const  userData  = useSelector((state) => state.auth.user);
  const { 
    clienteActual, 
    loading: loadingCliente, 
    error: errorCliente,
    success: successCliente
  } = useSelector((state) => state.cliente);
  const { 
    empleadoActual, 
    loading: loadingEmpleado, 
    error: errorEmpleado,
    success: successEmpleado
  } = useSelector((state) => state.empleado);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    direccion: '',
    telefonos: []
  });
  const [newTelefono, setNewTelefono] = useState({
    numero: '',
    tipo: 'CELULAR'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const isEmpleado = userData?.tipo_persona === 'EMPLEADO';
  const perfilData = isEmpleado ? empleadoActual : clienteActual;
  const loading = isEmpleado ? loadingEmpleado : loadingCliente;
  const error = isEmpleado ? errorEmpleado : errorCliente;
  const success = isEmpleado ? successEmpleado : successCliente;

  useEffect(() => {
    if (userData?.persona_id) {
      if (isEmpleado) {
        dispatch(fetchEmpleadoById(userData.persona_id));
      } else {
        dispatch(fetchClienteById(userData.persona_id));
      }
    }
  }, [dispatch, userData]);

  useEffect(() => {
    if (perfilData) {
      setFormData({
        nombre: perfilData.nombre || '',
        apellido: perfilData.apellido || '',
        email: perfilData.email || '',
        direccion: perfilData.direccion || '',
        telefonos: perfilData.telefonos || []
      });
    }
  }, [perfilData]);

  useEffect(() => {
    if (success) {
      toast.success(success);
      if (isEmpleado) {
        dispatch(clearEmpleadoState());
      } else {
        dispatch(clearClienteState());
      }
      setIsEditing(false);
    }
  }, [success, dispatch, isEmpleado]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

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
  };

  const handleTelefonoChange = (e) => {
    const { name, value } = e.target;
    setNewTelefono(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addTelefono = () => {
    if (!newTelefono.numero) {
      toast.warn('Ingrese un número de teléfono');
      return;
    }

    setFormData(prev => ({
      ...prev,
      telefonos: [...prev.telefonos, {
        numero: newTelefono.numero,
        tipo: newTelefono.tipo
      }]
    }));
    setNewTelefono({ numero: '', tipo: 'CELULAR' });
  };

  const removeTelefono = (index) => {
    setFormData(prev => ({
      ...prev,
      telefonos: prev.telefonos.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.nombre.trim()) errors.nombre = 'Nombre es requerido';
    if (!formData.apellido.trim()) errors.apellido = 'Apellido es requerido';
    if (!formData.email.trim()) errors.email = 'Email es requerido';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const updatedData = {
      ...formData,
      telefonos: formData.telefonos.map(t => ({
        numero: t.numero,
        tipo: t.tipo
      }))
    };

    if (isEmpleado) {
      dispatch(updateEmpleado({
        empleadoId: userData.persona_id,
        empleadoData: updatedData
      }));
    } else {
      dispatch(updateCliente({
        clienteId: userData.persona_id,
        clienteData: updatedData
      }));
    }
  };

  const getTipoTelefonoLabel = (tipo) => {
    switch (tipo) {
      case 1: return 'Celular';
      case 2: return 'Casa';
      case 3: return 'Trabajo';
      default: return tipo;
    }
  };

  if (loading && !perfilData) {
    return (
      <div className="text-center mt-5">
        <Spinner color="primary" />
        <p>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <Card>
        <CardHeader className="d-flex justify-content-between align-items-center">
          <h4>Perfil de Usuario</h4>
          {isEmpleado && (
            <Badge color="info" className="p-2">
              Empleado: {empleadoActual?.tipo_empleado}
            </Badge>
          )}
        </CardHeader>
        <CardBody>
          {error && <Alert color="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="usuario">Usuario</Label>
                  <Input
                    type="text"
                    id="usuario"
                    value={userData?.usuario || ''}
                    disabled
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="email">Email *</Label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    invalid={!!validationErrors.email}
                  />
                  {validationErrors.email && (
                    <div className="invalid-feedback d-block">
                      {validationErrors.email}
                    </div>
                  )}
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="nombre">Nombre *</Label>
                  <Input
                    type="text"
                    name="nombre"
                    id="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    disabled={!isEditing}
                    invalid={!!validationErrors.nombre}
                  />
                  {validationErrors.nombre && (
                    <div className="invalid-feedback d-block">
                      {validationErrors.nombre}
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="apellido">Apellido *</Label>
                  <Input
                    type="text"
                    name="apellido"
                    id="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    disabled={!isEditing}
                    invalid={!!validationErrors.apellido}
                  />
                  {validationErrors.apellido && (
                    <div className="invalid-feedback d-block">
                      {validationErrors.apellido}
                    </div>
                  )}
                </FormGroup>
              </Col>
            </Row>

            {!isEmpleado && (
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="dni">DNI</Label>
                    <Input
                      type="text"
                      id="dni"
                      value={perfilData?.dni || ''}
                      disabled
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="direccion">Dirección</Label>
                    <Input
                      type="text"
                      name="direccion"
                      id="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </FormGroup>
                </Col>
              </Row>
            )}

            <h5 className="mt-4">Teléfonos</h5>
            <Table bordered>
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Número</th>
                  {isEditing && <th>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {formData.telefonos.map((telefono, index) => (
                  <tr key={index}>
                    <td>{getTipoTelefonoLabel(telefono.tipo)}</td>
                    <td>{telefono.numero}</td>
                    {isEditing && (
                      <td>
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => removeTelefono(index)}
                        >
                          Eliminar
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
                {isEditing && (
                  <tr>
                    <td>
                      <Input
                        type="select"
                        name="tipo"
                        value={newTelefono.tipo}
                        onChange={handleTelefonoChange}
                      >
                        <option value="CELULAR">Celular</option>
                        <option value="CASA">Casa</option>
                        <option value="TRABAJO">Trabajo</option>
                      </Input>
                    </td>
                    <td>
                      <Input
                        type="text"
                        name="numero"
                        placeholder="Número"
                        value={newTelefono.numero}
                        onChange={handleTelefonoChange}
                      />
                    </td>
                    <td>
                      <Button
                        color="success"
                        size="sm"
                        onClick={addTelefono}
                      >
                        Agregar
                      </Button>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

            <div className="d-flex justify-content-end mt-4">
              {!isEditing ? (
                <Button
                  color="primary"
                  onClick={() => setIsEditing(true)}
                  disabled={loading}
                >
                  Editar Perfil
                </Button>
              ) : (
                <>
                  <Button
                    color="secondary"
                    className="me-2"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        nombre: perfilData.nombre || '',
                        apellido: perfilData.apellido || '',
                        email: perfilData.email || '',
                        direccion: perfilData.direccion || '',
                        telefonos: perfilData.telefonos || []
                      });
                    }}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    color="primary"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? <Spinner size="sm" /> : 'Guardar Cambios'}
                  </Button>
                </>
              )}
            </div>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default PerfilUsuarioComponent;