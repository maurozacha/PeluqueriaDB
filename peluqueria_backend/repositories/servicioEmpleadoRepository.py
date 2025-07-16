from peluqueria_backend.extensions import db
from peluqueria_backend.models import servicioEmpleado
from peluqueria_backend.exceptions.exceptions import APIError
import logging

logger = logging.getLogger(__name__)

class ServicioEmpleadoRepository:
    @staticmethod
    def asignar_empleado(servicio_id, empleado_id, usuario_alta=None):
        try:
            stmt = servicioEmpleado.insert().values(
                SERVICIO_ID=servicio_id,
                EMPLEADO_ID=empleado_id,
                USUARIO_ALTA=usuario_alta
            )
            db.session.execute(stmt)
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error al asignar empleado a servicio: {str(e)}")
            raise APIError("Error al asignar empleado a servicio", status_code=500)

    @staticmethod
    def desasignar_empleado(servicio_id, empleado_id):
        try:
            stmt = servicioEmpleado.delete().where(
                (servicioEmpleado.c.SERVICIO_ID == servicio_id) &
                (servicioEmpleado.c.EMPLEADO_ID == empleado_id)
            )
            result = db.session.execute(stmt)
            db.session.commit()
            return result.rowcount > 0
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error al desasignar empleado de servicio: {str(e)}")
            raise APIError("Error al desasignar empleado de servicio", status_code=500)

    @staticmethod
    def obtener_empleados_por_servicio(servicio_id):
        try:
            from peluqueria_backend.models.empleado import Empleado
            from peluqueria_backend.models.servicioEmpleado import ServicioEmpleado

            return db.session.query(Empleado)\
                .join(ServicioEmpleado, ServicioEmpleado.EMPLEADO_ID == Empleado.ID)\
                .options(
                    db.joinedload(Empleado.servicios) 
                )\
                .filter(ServicioEmpleado.SERVICIO_ID == servicio_id)\
                .all()
        except Exception as e:
            logger.error(f"Error al obtener empleados por servicio: {str(e)}", exc_info=True)
            raise APIError(
                "Error al obtener empleados por servicio", 
                status_code=500,
                payload={'servicio_id': servicio_id, 'error': str(e)}
            )
        
    @staticmethod
    def obtener_servicios_por_empleado(empleado_id):
        try:
            from peluqueria_backend.models.servicio import Servicio
            return db.session.query(Servicio).join(
                servicioEmpleado,
                servicioEmpleado.c.SERVICIO_ID == Servicio.ID
            ).filter(
                servicioEmpleado.c.EMPLEADO_ID == empleado_id
            ).all()
        except Exception as e:
            logger.error(f"Error al obtener servicios por empleado: {str(e)}")
            raise APIError("Error al obtener servicios por empleado", status_code=500)