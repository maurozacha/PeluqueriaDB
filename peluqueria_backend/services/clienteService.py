from venv import logger
from peluqueria_backend.exceptions.exceptions import APIError
from peluqueria_backend.models.cliente import Cliente
from peluqueria_backend.repositories.clienteRepository import ClienteRepository
from peluqueria_backend.services.telefonoService import TelefonoService

class ClienteService:
    @staticmethod
    def listar_clientes():
        try:
            return ClienteRepository.get_all()
        except Exception as e:
            raise APIError(
                "Error al obtener la lista de clientes",
                status_code=500,
                payload={'details': str(e)}
            )

    @staticmethod
    def crear_cliente(data):
        if not data:
            raise APIError("Datos del cliente no proporcionados", status_code=400)
            
        required_fields = ['nombre', 'apellido', 'email', 'dni']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            raise APIError(
                f"Faltan campos obligatorios: {', '.join(missing_fields)}",
                status_code=400
            )

        if ClienteRepository.existe_cliente(data.get('email'), data.get('dni')):
            raise APIError(
                f"El cliente con email {data.get('email')} o DNI {data.get('dni')} ya existe",
                status_code=409
            )
            
        try:
            cliente = Cliente(**data)
            cliente_creado = ClienteRepository.create(cliente)
            return cliente_creado
        except Exception as e:
            raise APIError(
                "Error al crear el cliente",
                status_code=500,
                payload={'details': str(e)}
            )
    
    @staticmethod
    def obtener_cliente(identifier):
    
        if not identifier:
            raise APIError("Identificador no proporcionado (se requiere ID o DNI)", status_code=400)
            
        cliente = ClienteRepository.get_by_identifier(identifier)

        if not cliente:
            raise APIError(f"Cliente con identificador '{identifier}' no encontrado", status_code=404)
        
        try:
            telefonos = TelefonoService.obtener_telefonos_por_cliente(cliente.ID)
            cliente.telefonos = telefonos
        except Exception as e:
            logger.warning(f"No se pudieron obtener los teléfonos del cliente: {str(e)}")
            cliente.telefonos = []
        
        return cliente
    

    @staticmethod
    def actualizar_cliente(cliente_id, data):

        if not cliente_id or not isinstance(cliente_id, int):
            raise APIError("ID de cliente no válido", status_code=400)

        if not data:
            raise APIError("No se proporcionaron datos para actualizar", status_code=400)

        try:
            cliente = ClienteRepository.get_by_id(cliente_id)
            if not cliente:
                raise APIError(f"Cliente con ID {cliente_id} no encontrado", status_code=404)

            if 'email' in data or 'dni' in data:
                nuevo_email = data.get('email', cliente.email)
                nuevo_dni = data.get('dni', cliente.dni)

                cliente_existente = ClienteRepository.existe_cliente_distinto(
                    nuevo_email, 
                    nuevo_dni, 
                    cliente_id
                )
                if cliente_existente:
                    raise APIError(
                        "El email o DNI ya está en uso por otro cliente",
                        status_code=409
                    )

            campos_permitidos = ['nombre', 'apellido', 'email', 'dni', 'direccion']
            for campo in campos_permitidos:
                if campo in data:
                    setattr(cliente, campo, data[campo])
            
            if 'telefonos' in data:
               TelefonoService.actualizar_telefonos_cliente(cliente_id, data['telefonos'])

            cliente_actualizado = ClienteRepository.update(cliente)

            telefonos = TelefonoService.obtener_telefonos_por_cliente(cliente_id)
            cliente_actualizado.telefonos = telefonos
            
            return cliente_actualizado

        except APIError:
            raise
        except Exception as e:
            raise APIError(
                f"Error al actualizar cliente: {str(e)}",
                status_code=500
            )