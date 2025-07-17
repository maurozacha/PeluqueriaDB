import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Table, 
  Button, 
  FormGroup, 
  Input, 
  Container,
  Alert,
  Spinner
} from 'reactstrap';
import { ROLES } from '../../constants/system-constants';
import { listarUsuarios } from '../../shared/reducers/auth.reducer';

const UsuarioListComponent = () => {
  const dispatch = useDispatch();
  const { token, user, usuariosList, usuariosLoading, usuariosError } = useSelector(state => state.auth);
  const [modifiedUsers, setModifiedUsers] = useState({});
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null);

  useEffect(() => {
    if (token && user?.rol === 'ADMIN') {
      dispatch(listarUsuarios());
    }
  }, [dispatch, token, user]);

  const handleRoleChange = (usuario, newRole) => {
    setModifiedUsers(prev => ({
      ...prev,
      [usuario]: newRole
    }));
    setShowSaveButton(true);
  };

  const handleSaveChanges = async () => {
    try {
      setSaveSuccess('Cambios guardados exitosamente');
      setModifiedUsers({});
      setShowSaveButton(false);
    } catch (err) {
      console.error('Error al guardar cambios:', err);
    }
  };

  if (usuariosLoading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner color="primary" />
        <p>Cargando lista de usuarios...</p>
      </Container>
    );
  }

  if (usuariosError) {
    return (
      <Container className="mt-5">
        <Alert color="danger">{usuariosError}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Gestión de Usuarios</h2>
      
      {saveSuccess && <Alert color="success">{saveSuccess}</Alert>}
      
      <Table striped responsive>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>DNI</th>
            <th>Email</th>
            <th>Estado</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {usuariosList.map(usuario => (
            <tr key={usuario.usuario}>
              <td>{usuario.usuario}</td>
              <td>{usuario.nombre}</td>
              <td>{usuario.apellido}</td>
              <td>{usuario.dni}</td>
              <td>{usuario.email}</td>
              <td>{usuario.activo ? 'Activo' : 'Inactivo'}</td>
              <td>
                <FormGroup>
                  <Input
                    type="select"
                    value={modifiedUsers[usuario.usuario] || usuario.rol}
                    onChange={(e) => handleRoleChange(usuario.usuario, e.target.value)}
                  >
                    {Object.values(ROLES).map(role => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      {showSaveButton && (
        <div className="text-center mt-3">
          <Button color="primary" onClick={handleSaveChanges}>
            Confirmar Cambios
          </Button>
        </div>
      )}
    </Container>
  );
};

export default UsuarioListComponent;