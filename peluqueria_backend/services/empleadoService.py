from peluqueria_backend.exceptions.exceptions import APIError
from peluqueria_backend.models.empleado import Empleado
from peluqueria_backend.repositories.empleadoRepository import EmpleadoRepository
import logging

logger = logging.getLogger(__name__)

class EmpleadoService:
    @staticmethod
    def listar_empleados():
        try:
            empleados = EmpleadoRepository.get_all()
            logger.debug(f"Se encontraron {len(empleados)} empleados")
            return empleados
        except Exception as e:
            logger.error(f"Error al listar empleados: {str(e)}")
            raise APIError(
                "Error al obtener la lista de empleados",
                status_code=500,
                payload={'details': str(e)}
            )

    @staticmethod
    def crear_empleado(data):
        if not data:
            raise APIError("Datos del empleado no proporcionados", status_code=400)

        required_fields = ['nombre', 'apellido', 'email', 'dni']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            raise APIError(
                f"Faltan campos obligatorios: {', '.join(missing_fields)}",
                status_code=400
            )

        if EmpleadoRepository.existe_empleado(email=data.get('email'), dni=data.get('dni')):
            raise APIError(
                f"El empleado con email {data.get('email')} o DNI {data.get('dni')} ya existe",
                status_code=409
            )

        try:
            empleado = Empleado(**data)
            empleado_creado = EmpleadoRepository.create(empleado)
            logger.info(f"Empleado {empleado_creado.nombre} {empleado_creado.apellido} creado con ID {empleado_creado.id}")
            return empleado_creado
        except Exception as e:
            logger.error(f"Error al crear empleado: {str(e)}")
            raise APIError(
                "Error al crear el empleado",
                status_code=500,
                payload={'details': str(e)}
            )

    @staticmethod
    def obtener_empleado_por_id(empleado_id):
        try:
            if not empleado_id or not isinstance(empleado_id, int):
                raise APIError("ID de empleado no válido", status_code=400)
                
            empleado = EmpleadoRepository.get_by_id(empleado_id)
            
            if not empleado:
                raise APIError(f"Empleado con ID {empleado_id} no encontrado", status_code=404)
                
            logger.debug(f"Empleado {empleado_id} encontrado")
            return empleado
        except APIError:
            raise
        except Exception as e:
            logger.error(f"Error al obtener empleado {empleado_id}: {str(e)}")
            raise APIError(
                f"Error al buscar empleado con ID {empleado_id}",
                status_code=500,
                payload={'details': str(e)}
            )

    @staticmethod
    def actualizar_empleado(empleado_id, data):
        try:
            if not data:
                raise APIError("Datos de actualización no proporcionados", status_code=400)
                
            empleado = EmpleadoService.obtener_empleado_por_id(empleado_id)
            
            for key, value in data.items():
                setattr(empleado, key, value)
                
            empleado_actualizado = EmpleadoRepository.update(empleado)
            logger.info(f"Empleado {empleado_id} actualizado correctamente")
            return empleado_actualizado
        except APIError:
            raise
        except Exception as e:
            logger.error(f"Error al actualizar empleado {empleado_id}: {str(e)}")
            raise APIError(
                f"Error al actualizar empleado con ID {empleado_id}",
                status_code=500,
                payload={'details': str(e)}
            )