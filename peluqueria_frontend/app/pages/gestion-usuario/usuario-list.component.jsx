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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ROLES } from '../../constants/system-constants';
import { listarUsuarios, actualizarRolUsuario } from '../../shared/reducers/auth.reducer';

const UsuarioListComponent = () => {
  const dispatch = useDispatch();
  const { token, user, usuariosList, usuariosLoading, usuariosError } = useSelector(state => state.auth);
  const [modifiedUsers, setModifiedUsers] = useState({});
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (token && user?.rol === 'ADMIN') {
      dispatch(listarUsuarios());
    }
  }, [dispatch, token, user]);

  const handleRoleChange = (userId, newRole) => {
    setModifiedUsers(prev => ({
      ...prev,
      [userId]: newRole
    }));
    setShowSaveButton(true);
  };

  const handleSaveChanges = async () => {
    setIsUpdating(true);
    try {
      const updates = Object.entries(modifiedUsers).map(([userId, nuevoRol]) => 
        dispatch(actualizarRolUsuario({ usuario: userId, nuevoRol }))
      );
      
      await Promise.all(updates);
      
      toast.success('Roles actualizados correctamente', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      
      await dispatch(listarUsuarios());
      
      setModifiedUsers({});
      setShowSaveButton(false);
    } catch (error) {
      toast.error('Error al actualizar roles', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (usuariosLoading || isUpdating) {
    return (
      <Container className="mt-5 text-center">
        <Spinner color="primary" />
        <p className="text-white">{isUpdating ? 'Actualizando usuarios...' : 'Cargando lista de usuarios...'}</p>
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
    <Container className="mt-4" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h2 className="mb-4 text-center">Gestión de Usuarios</h2>
      
      <Table striped responsive className="mt-4">
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
                    value={modifiedUsers[usuario.id] || usuario.rol}
                    onChange={(e) => handleRoleChange(usuario.id, e.target.value)}
                    disabled={isUpdating}
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
          <Button 
            color="primary" 
            onClick={handleSaveChanges}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <Spinner size="sm" /> Actualizando...
              </>
            ) : 'Confirmar Cambios'}
          </Button>
        </div>
      )}
    </Container>
  );
};

export default UsuarioListComponent;