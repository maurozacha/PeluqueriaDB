from peluqueria_backend.exceptions.exceptions import APIError
from peluqueria_backend.models.cliente import Cliente
from peluqueria_backend.repositories.clienteRepository import ClienteRepository

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
        """
        Obtiene un cliente por ID o DNI
        
        Args:
            identifier (int/str): ID numérico o DNI del cliente
            
        Returns:
            Cliente: El cliente encontrado
            
        Raises:
            APIError: Si no se proporciona identificador o no se encuentra el cliente
        """
        if not identifier:
            raise APIError("Identificador no proporcionado (se requiere ID o DNI)", status_code=400)
            
        cliente = ClienteRepository.get_by_identifier(identifier)
        
        if not cliente:
            raise APIError(f"Cliente con identificador '{identifier}' no encontrado", status_code=404)
        
        return cliente