import React, { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  Alert,
  Form,
  Button
} from 'reactstrap';

const ModalPago = ({
  isOpen,
  toggle,
  metodosPago,
  monto,
  empleado,
  servicio,
  onConfirmarPago,
  initialMetodoPago = null,
  initialNotasPago = ''
}) => {
  const [metodoPago, setMetodoPago] = useState(initialMetodoPago);
  const [notasPago, setNotasPago] = useState(initialNotasPago);

  const handleConfirmar = () => {
    onConfirmarPago({
      metodoPagoId: metodoPago,
      notas: notasPago
    });
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Pagar</ModalHeader>
      <ModalBody>
        <Form>
          {empleado && (
            <div className="mb-3">
              <h6>Empleado: {empleado.nombre} {empleado.apellido}</h6>
            </div>
          )}
          
          {servicio && (
            <div className="mb-3">
              <h6>Servicio: {servicio.nombre}</h6>
            </div>
          )}

          <FormGroup tag="fieldset">
            <legend>Método de pago</legend>
            {metodosPago?.map((metodo) => (
              <FormGroup check key={metodo.ID}>
                <Input
                  type="radio"
                  name="metodoPago"
                  id={`metodo-${metodo.ID}`}
                  checked={metodoPago === metodo.ID}
                  onChange={() => setMetodoPago(metodo.ID)}
                />
                <Label check for={`metodo-${metodo.ID}`}>
                  {metodo.NOMBRE}
                </Label>
                {metodo.ID === 2 && metodoPago === 2 && (
                  <Alert color="info" className="mt-2">
                    Por favor, preséntese 15 minutos antes del turno.
                  </Alert>
                )}
              </FormGroup>
            ))}
          </FormGroup>
          
          <FormGroup>
            <Label for="notasPago">Notas adicionales</Label>
            <Input
              type="textarea"
              id="notasPago"
              value={notasPago}
              onChange={(e) => setNotasPago(e.target.value)}
              maxLength={500}
              placeholder="Información adicional para el pago (opcional)"
            />
          </FormGroup>
          
          <div className="mt-3">
            <h5>Total a pagar: ${monto || 0}</h5>
          </div>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancelar
        </Button>
        <Button 
          color="primary" 
          onClick={handleConfirmar} 
          disabled={!metodoPago}
        >
          Confirmar Pago
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ModalPago;