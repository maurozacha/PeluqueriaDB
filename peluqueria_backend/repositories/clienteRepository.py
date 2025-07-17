
from flask import current_app
from peluqueria_backend.exceptions.exceptions import APIError
from peluqueria_backend.extensions import db
from peluqueria_backend.models.cliente import Cliente

class ClienteRepository:

    @staticmethod
    def get_all():
        try:
            from peluqueria_backend.models.enumerations.tipoPersonaEnum import TipoPersona
            from sqlalchemy import or_

            return Cliente.query.filter(
                or_(
                    Cliente.tipo_persona == TipoPersona.CLIENTE.value,
                    Cliente.tipo_persona == 'Cliente' 
                )
            ).all()

        except Exception as e:
            import traceback
            error_details = {
                'error_type': type(e).__name__,
                'error_message': str(e),
                'stack_trace': traceback.format_exc(),
                'query_executed': 'Cliente.query.filter(or_(tipo_persona=="CLIENTE", tipo_persona=="Cliente")).all()',
                'database_status': {
                    'connected': db.session.bind.pool.status() if db.session.bind else False,
                    'transaction_status': 'active' if db.session.is_active else 'inactive'
                },
                'enum_values': [e.value for e in TipoPersona]
            }

            current_app.logger.error(
                "Error en ClienteRepository.get_all():\n"
                f"Error: {str(e)}\n"
                f"Traceback: {traceback.format_exc()}\n"
                f"Enum values: {[e.value for e in TipoPersona]}"
            )

            raise APIError(
                "Error al obtener la lista de clientes",
                status_code=500,
                payload=error_details
            )

    @staticmethod
    def get_by_id(cliente_id):
      
        try:
            if not cliente_id or not isinstance(cliente_id, int):
                raise ValueError("ID de cliente no válido")

            cliente = Cliente.query.get(cliente_id)

            return cliente

        except ValueError as e:
            raise APIError(
                str(e),
                status_code=400,
                payload={
                    'input_data': {'cliente_id': cliente_id},
                    'expected_type': 'int'
                }
            )
        except Exception as e:
            import traceback
            error_details = {
                'error_type': type(e).__name__,
                'error_message': str(e),
                'stack_trace': traceback.format_exc(),
                'query_executed': f"Cliente.query.get({cliente_id})",
                'input_data': {'cliente_id': cliente_id},
                'database_status': {
                    'connected': db.session.bind.pool.status() if db.session.bind else False,
                    'transaction_status': 'active' if db.session.is_active else 'inactive'
                }
            }

            current_app.logger.error(
                "Error en ClienteRepository.get_by_id():\n"
                f"ID buscado: {cliente_id}\n"
                f"Error: {str(e)}\n"
                f"Traceback: {traceback.format_exc()}\n"
                f"Session status: {'Active' if db.session.is_active else 'Inactive'}"
            )

            raise APIError(
                "Error al buscar cliente por ID",
                status_code=500,
                payload=error_details
            )

    @staticmethod
    def existe_cliente(email, dni):
       
        try:
            if email is None and dni is None:
                raise ValueError("Se requiere al menos email o DNI para la verificación")

            email = email.strip().lower() if email else None
            dni = dni.strip() if dni else None


            try:
                with db.session.no_autoflush:
                    query = db.session.query(Cliente)

                    conditions = []
                    if email:
                        conditions.append(Cliente.email == email)
                    if dni:
                        conditions.append(Cliente.dni == dni)

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

            import traceback
            current_app.logger.error(
                "Error en existe_cliente:\n"
                f"Input: email={email}, dni={dni}\n"
                f"Error: {str(e)}\n"
                f"Traceback: {traceback.format_exc()}\n"
                f"Session status: {'Active' if db.session.is_active else 'Inactive'}"
            )
            
            raise APIError(
                "Error al verificar existencia de cliente",
                status_code=500,
                payload=error_details
            )
    
    @staticmethod
    def create(cliente):
        try:
            db.session.add(cliente)
            db.session.commit()
            return cliente
        except Exception as e:
            db.session.rollback()
            raise APIError(
                "Error al crear cliente en la base de datos",
                status_code=500,
                payload={'details': str(e)}
            )



    @staticmethod
    def get_by_identifier(identifier):
        
        try:
            if not identifier:
                raise ValueError("Identificador no proporcionado")

            if isinstance(identifier, int) or (isinstance(identifier, str) and identifier.isdigit()):
                cliente_id = int(identifier)
                cliente = Cliente.query.get(cliente_id)
            else:
                cliente = Cliente.query.filter_by(dni=identifier).first()

            return cliente

        except ValueError as e:
            raise APIError(
                str(e),
                status_code=400,
                payload={
                    'input_data': {'identifier': identifier},
                    'expected_types': 'int (ID) o str (DNI)'
                }
            )
        except Exception as e:
            import traceback
            error_details = {
                'error_type': type(e).__name__,
                'error_message': str(e),
                'stack_trace': traceback.format_exc(),
                'query_executed': f"Cliente.query.get/filter_by({identifier})",
                'input_data': {'identifier': identifier},
                'database_status': {
                    'connected': db.session.bind.pool.status() if db.session.bind else False,
                    'transaction_status': 'active' if db.session.is_active else 'inactive'
                }
            }

            current_app.logger.error(
                "Error en ClienteRepository.get_by_identifier():\n"
                f"Identificador buscado: {identifier}\n"
                f"Error: {str(e)}\n"
                f"Traceback: {traceback.format_exc()}"
            )

            raise APIError(
                "Error al buscar cliente por identificador",
                status_code=500,
                payload=error_details
            )

    @staticmethod
    def update(cliente):
        try:
            db.session.commit()
            return cliente
        except Exception as e:
            db.session.rollback()
            raise APIError(
                "Error al actualizar cliente en la base de datos",
                status_code=500,
                payload={'details': str(e)}
            )

    @staticmethod
    def existe_cliente_distinto(email, dni, cliente_id):
    
        try:
            email = email.strip().lower() if email else None
            dni = dni.strip() if dni else None

            query = Cliente.query.filter(
                Cliente.ID != cliente_id,
                db.or_(
                    Cliente.email == email,
                    Cliente.dni == dni
                )
            )

            return query.first() is not None

        except Exception as e:
            raise APIError(
                "Error al verificar existencia de cliente",
                status_code=500,
                payload={'details': str(e)}
            )