import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  Card,
  CardBody,
  CardTitle,
  Spinner,
  Row,
  Col,
} from "reactstrap";
import { register } from "../../shared/reducers/auth.reducer";
import "../../shared/styles/register.scss";

const RegistroComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, registrationStatus } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    dni: "",
    usuario: "",
    contrasena: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(formData))
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        console.error("Error en registro:", err);
      });
  };

  return (
    <div className="register-page">
      <Card className="register-card">
        <CardBody>
          <CardTitle tag="h2" className="text-center">
            Registro de Usuario
          </CardTitle>

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="nombre">Nombre</Label>
                  <Input
                    type="text"
                    name="nombre"
                    id="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="apellido">Apellido</Label>
                  <Input
                    type="text"
                    name="apellido"
                    id="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              </Col>
            </Row>

            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="dni">DNI</Label>
              <Input
                type="text"
                name="dni"
                id="dni"
                value={formData.dni}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="usuario">Usuario</Label>
              <Input
                type="text"
                name="usuario"
                id="usuario"
                value={formData.usuario}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="contrasena">Contraseña</Label>
              <Input
                type="contrasena"
                name="contrasena"
                id="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                required
              />
            </FormGroup>

            {error && <Alert color="danger">{error}</Alert>}
            {registrationStatus === "success" && (
              <Alert color="success">¡Registro exitoso!</Alert>
            )}

            <Button
              color="primary"
              type="submit"
              className="button-sm-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Registrando...
                </>
              ) : (
                "Registrarse"
              )}
            </Button>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default RegistroComponent;
