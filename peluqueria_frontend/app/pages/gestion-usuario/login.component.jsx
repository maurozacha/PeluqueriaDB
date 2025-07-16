import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  Input,
  Label,
  Spinner
} from 'reactstrap';
import { clearAuthState, login } from '../../shared/reducers/auth.reducer';
import '../../shared/styles/login.scss';

const LoginComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { 
    isAuthenticated, 
    loading, 
    error, 
    loginSuccess,
    loginMessage,
    userData
  } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    usuario: '',
    contrasena: ''
  });

  useEffect(() => {
    dispatch(clearAuthState());
  }, [dispatch]);

  useEffect(() => {
    if (loginSuccess && isAuthenticated) {
      toast.success(loginMessage || 'Inicio de sesión exitoso');
      
      const timer = setTimeout(() => {
        navigate('/');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [loginSuccess, isAuthenticated, loginMessage, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData))
      .unwrap()
      .catch((err) => {
        console.error("Login error:", err);
      });
  };

  return (
    <div className="login-page">
      <Card className="login-card">
        <CardBody>
          <CardTitle tag="h2" className="text-center mb-4">
            Iniciar Sesión
          </CardTitle>

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="usuario">Usuario</Label>
              <Input
                type="text"
                name="usuario"
                id="usuario"
                value={formData.usuario}
                onChange={handleChange}
                disabled={loading}
                required
                placeholder="Ingrese su nombre de usuario"
              />
            </FormGroup>

            <FormGroup>
              <Label for="contrasena">Contraseña</Label>
              <Input
                type="password"
                name="contrasena"
                id="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                disabled={loading}
                required
                placeholder="Ingrese su contraseña"
              />
            </FormGroup>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <Button
                color="primary"
                type="submit"
                className="w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Iniciando sesión...
                  </>
                ) : (
                  'Ingresar'
                )}
              </Button>
            </div>

            <div className="text-center">
              <p className="mb-0">
                ¿No tienes una cuenta?{' '}
                <a 
                  href="/register" 
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/register');
                  }}
                  className="text-primary"
                >
                  Regístrate aquí
                </a>
              </p>
            </div>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default LoginComponent;