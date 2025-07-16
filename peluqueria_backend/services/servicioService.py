from datetime import datetime
from peluqueria_backend.exceptions.exceptions import APIError
from peluqueria_backend.repositories.empleadoRepository import EmpleadoRepository
from peluqueria_backend.repositories.servicioEmpleadoRepository import ServicioEmpleadoRepository
from peluqueria_backend.repositories.servicioRepository import ServicioRepository
from peluqueria_backend.models.servicio import Servicio
import logging

logger = logging.getLogger(__name__)

class ServicioService:
    @staticmethod
    def obtener_servicio_por_id(servicio_id: int) -> Servicio:
        try:
            logger.debug(f"Buscando servicio con ID: {servicio_id}")
            servicio = ServicioRepository.get_by_id(servicio_id)
            
            if not servicio:
                logger.warning(f"Servicio con ID {servicio_id} no encontrado")
                raise APIError("Servicio no encontrado", status_code=404)
                
            logger.info(f"Servicio encontrado: {servicio.ID} - {servicio.nombre}")
            return servicio
            
        except Exception as e:
            logger.error(f"Error al obtener servicio {servicio_id}: {str(e)}", exc_info=True)
            raise APIError(
                "Error al obtener servicio",
                status_code=500,
                payload={'servicio_id': servicio_id, 'error': str(e)}
            )

    @staticmethod
    def listar_servicios(activos: bool = True) -> list[Servicio]:
        try:
            logger.debug("Listando todos los servicios")
            servicios = ServicioRepository.get_all()
            
            if activos:
                servicios = [s for s in servicios if not s.fecha_baja]
                logger.debug(f"Filtrados {len(servicios)} servicios activos")
            
            logger.info(f"Retornando {len(servicios)} servicios")
            return servicios
            
        except Exception as e:
            logger.error(f"Error al listar servicios: {str(e)}", exc_info=True)
            raise APIError(
                "Error al listar servicios",
                status_code=500,
                payload={'error': str(e)}
            )

    @staticmethod
    def obtener_servicios_por_empleado(empleado_id: int) -> list[Servicio]:
        try:
            logger.debug(f"Buscando servicios para empleado ID: {empleado_id}")
            
            empleado = EmpleadoRepository.get_by_id(empleado_id)
            if not empleado or not empleado.activo:
                logger.warning(f"Empleado {empleado_id} no encontrado o inactivo")
                raise APIError("Empleado no disponible", status_code=404)
            
            servicios = ServicioRepository.get_all()
            
            servicios_disponibles = [
                s for s in servicios 
                if not hasattr(s, 'especialidad') or 
                   not s.especialidad or 
                   s.especialidad == empleado.especialidad
            ]
            
            logger.info(f"Encontrados {len(servicios_disponibles)} servicios para empleado {empleado_id}")
            return servicios_disponibles
            
        except APIError:
            raise
        except Exception as e:
            logger.error(f"Error al obtener servicios para empleado {empleado_id}: {str(e)}", exc_info=True)
            raise APIError(
                "Error al obtener servicios por empleado",
                status_code=500,
                payload={'empleado_id': empleado_id, 'error': str(e)}
            )

    @staticmethod
    def crear_servicio(
        nombre: str, 
        precio: float, 
        duracion_estimada: int = 30,
        descripcion: str = None,
        especialidad: str = None,
        usuario_alta: str = None
    ) -> Servicio:
        try:
            logger.debug(f"Creando nuevo servicio: {nombre}")
            
            servicio_data = {
                'nombre': nombre,
                'precio': precio,
                'duracion_estimada': duracion_estimada,
                'descripcion': descripcion,
                'especialidad': especialidad,
                'usuario_alta': usuario_alta,
                'fecha_alta': datetime.now()
            }
            
            servicio = ServicioRepository.create(**servicio_data)
            logger.info(f"Servicio creado exitosamente: {servicio.ID} - {servicio.nombre}")
            return servicio
            
        except Exception as e:
            logger.error(f"Error al crear servicio {nombre}: {str(e)}", exc_info=True)
            raise APIError(
                "Error al crear servicio",
                status_code=500,
                payload={'servicio_data': servicio_data, 'error': str(e)}
            )
    
    @staticmethod
    def obtener_empleados_por_servicio(servicio_id: int):
        try:
            logger.debug(f"Buscando empleados para servicio ID: {servicio_id}")
            empleados = ServicioEmpleadoRepository.obtener_empleados_por_servicio(servicio_id)
            logger.info(f"Encontrados {len(empleados)} empleados para servicio {servicio_id}")
            return empleados
        except Exception as e:
            logger.error(f"Error al obtener empleados por servicio {servicio_id}: {str(e)}", exc_info=True)
            raise APIError(
                "Error al obtener empleados por servicio",
                status_code=500,
                payload={'servicio_id': servicio_id, 'error': str(e)}
            )

    @staticmethod
    def asignar_empleado(servicio_id: int, empleado_id: int, usuario_alta: str = None):
        try:
            logger.debug(f"Asignando empleado {empleado_id} a servicio {servicio_id}")
            result = ServicioEmpleadoRepository.asignar_empleado(servicio_id, empleado_id, usuario_alta)
            if result:
                logger.info(f"Empleado {empleado_id} asignado exitosamente a servicio {servicio_id}")
                return True
            raise APIError("No se pudo asignar el empleado al servicio", status_code=400)
        except Exception as e:
            logger.error(f"Error al asignar empleado {empleado_id} a servicio {servicio_id}: {str(e)}", exc_info=True)
            raise APIError(
                "Error al asignar empleado al servicio",
                status_code=500,
                payload={'servicio_id': servicio_id, 'empleado_id': empleado_id, 'error': str(e)}
            )