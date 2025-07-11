from peluqueria_backend.exceptions.exceptions import APIError
from peluqueria_backend.extensions import db
from peluqueria_backend.models.empleado import Empleado
import logging

logger = logging.getLogger(__name__)

class EmpleadoRepository:
    @staticmethod
    def get_all():
        try:
            empleados = Empleado.query.all()
            logger.debug(f"Recuperados {len(empleados)} empleados de la base de datos")
            return empleados
        except Exception as e:
            import traceback
            error_details = {
                'error_type': type(e).__name__,
                'error_message': str(e),
                'stack_trace': traceback.format_exc(),
                'query_executed': 'Empleado.query.all()',
                'database_status': {
                    'connected': db.session.bind.pool.status() if db.session.bind else False,
                    'transaction_status': 'active' if db.session.is_active else 'inactive'
                }
            }
            
            logger.error(
                "Error en EmpleadoRepository.get_all():\n"
                f"Error: {str(e)}\n"
                f"Traceback: {traceback.format_exc()}"
            )
            
            raise APIError(
                "Error al obtener la lista de empleados",
                status_code=500,
                payload=error_details
            )
    @staticmethod
    def get_by_id(empleado_id):
        try:
            if not empleado_id or not isinstance(empleado_id, int):
                raise ValueError("ID de empleado no válido")

            empleado = Empleado.query.get(empleado_id)

            if empleado:
                from peluqueria_backend.models.enumerations.tipoPersonaEnum import TipoPersona
                empleado.tipo_persona = TipoPersona.EMPLEADO.value
                logger.debug(f"Empleado ID {empleado_id} encontrado - Tipo persona forzado a {TipoPersona.EMPLEADO.value}")
            else:
                logger.debug(f"Empleado ID {empleado_id} no encontrado")

            return empleado

        except ValueError as e:
            raise APIError(
                str(e),
                status_code=400,
                payload={
                    'input_data': {'empleado_id': empleado_id},
                    'expected_type': 'int'
                }
            )
        except Exception as e:
            import traceback
            error_details = {
                'error_type': type(e).__name__,
                'error_message': str(e),
                'stack_trace': traceback.format_exc(),
                'query_executed': f"Empleado.query.get({empleado_id})",
                'input_data': {'empleado_id': empleado_id},
                'database_status': {
                    'connected': db.session.bind.pool.status() if db.session.bind else False,
                    'transaction_status': 'active' if db.session.is_active else 'inactive'
                }
            }

            logger.error(
                "Error en EmpleadoRepository.get_by_id():\n"
                f"ID buscado: {empleado_id}\n"
                f"Error: {str(e)}\n"
                f"Traceback: {traceback.format_exc()}"
            )

            raise APIError(
                "Error al buscar empleado por ID",
                status_code=500,
                payload=error_details
            )

    @staticmethod
    def create(empleado):
        try:
            db.session.add(empleado)
            db.session.commit()
            logger.info(f"Empleado creado con ID {empleado.id}")
            return empleado
        except Exception as e:
            db.session.rollback()
            error_details = {
                'error_type': type(e).__name__,
                'error_message': str(e),
                'input_data': empleado.serialize() if hasattr(empleado, 'serialize') else str(empleado),
                'database_status': {
                    'connected': db.session.bind.pool.status() if db.session.bind else False,
                    'transaction_status': 'active' if db.session.is_active else 'inactive'
                }
            }
            
            logger.error(
                "Error en EmpleadoRepository.create():\n"
                f"Error: {str(e)}\n"
                f"Datos: {error_details['input_data']}"
            )
            
            raise APIError(
                "Error al crear empleado en la base de datos",
                status_code=500,
                payload=error_details
            )

    @staticmethod
    def update(empleado):
        try:
            db.session.commit()
            logger.info(f"Empleado {empleado.id} actualizado correctamente")
            return empleado
        except Exception as e:
            db.session.rollback()
            error_details = {
                'error_type': type(e).__name__,
                'error_message': str(e),
                'input_data': empleado.serialize() if hasattr(empleado, 'serialize') else str(empleado),
                'database_status': {
                    'connected': db.session.bind.pool.status() if db.session.bind else False,
                    'transaction_status': 'active' if db.session.is_active else 'inactive'
                }
            }
            
            logger.error(
                "Error en EmpleadoRepository.update():\n"
                f"Error: {str(e)}\n"
                f"Datos: {error_details['input_data']}"
            )
            
            raise APIError(
                "Error al actualizar empleado en la base de datos",
                status_code=500,
                payload=error_details
            )

    @staticmethod
    def delete(empleado):
        try:
            db.session.delete(empleado)
            db.session.commit()
            logger.info(f"Empleado {empleado.id} eliminado correctamente")
            return True
        except Exception as e:
            db.session.rollback()
            error_details = {
                'error_type': type(e).__name__,
                'error_message': str(e),
                'input_data': empleado.serialize() if hasattr(empleado, 'serialize') else str(empleado),
                'database_status': {
                    'connected': db.session.bind.pool.status() if db.session.bind else False,
                    'transaction_status': 'active' if db.session.is_active else 'inactive'
                }
            }
            
            logger.error(
                "Error en EmpleadoRepository.delete():\n"
                f"Error: {str(e)}\n"
                f"Datos: {error_details['input_data']}"
            )
            
            raise APIError(
                "Error al eliminar empleado de la base de datos",
                status_code=500,
                payload=error_details
            )
        
    @staticmethod
    def existe_empleado(email=None, dni=None):
        try:
            if email is None and dni is None:
                raise ValueError("Se requiere al menos email o DNI para la verificación")

            email = email.strip().lower() if email else None
            dni = dni.strip() if dni else None

            try:
                with db.session.no_autoflush:
                    query = db.session.query(Empleado)

                    conditions = []
                    if email:
                        conditions.append(Empleado.email == email)
                    if dni:
                        conditions.append(Empleado.dni == dni)

                    if not conditions:
                        return False

                    query = query.filter(db.or_(*conditions))
                    return query.first() is not None

            except Exception as db_error:
                db.session.rollback()
                raise db_error

        except ValueError as e:
            raise APIError(
                str(e),
                status_code=400,
                payload={'input_data': {'email': email, 'dni': dni}}
            )
        except Exception as e:
            error_details = {
                'error_type': type(e).__name__,
                'error_message': str(e),
                'input_data': {
                    'email_provided': email is not None,
                    'dni_provided': dni is not None
                },
                'database_connection': {
                    'connected': db.session.bind.pool.status() if db.session.bind else False
                }
            }

            logger.error(
                "Error en existe_empleado:\n"
                f"Input: email={email}, dni={dni}\n"
                f"Error: {str(e)}\n"
                f"Database status: {'Connected' if error_details['database_connection']['connected'] else 'Disconnected'}"
            )

            raise APIError(
                "Error al verificar existencia de empleado",
                status_code=500,
                payload=error_details
            )