from peluqueria_backend.exceptions.exceptions import APIError
from peluqueria_backend.models.telefono import Telefono
from peluqueria_backend.models.enumerations.tipoTelefonoEnum import TelefonoTipo
from peluqueria_backend.extensions import db
import logging

logger = logging.getLogger(__name__)

class TelefonoService:
    @staticmethod
    def obtener_telefonos_por_cliente(cliente_id):
        try:
            if not cliente_id or not isinstance(cliente_id, int):
                raise ValueError("ID de cliente no válido")
                
            telefonos = Telefono.query.filter_by(CLIENTE_ID=cliente_id).all()
            return telefonos
            
        except ValueError as e:
            raise APIError(str(e), status_code=400)
        except Exception as e:
            logger.error(f"Error al obtener teléfonos del cliente {cliente_id}: {str(e)}")
            raise APIError(
                f"Error al obtener teléfonos del cliente {cliente_id}",
                status_code=500,
                payload={'details': str(e)}
            )

    @staticmethod
    def actualizar_telefonos_cliente(cliente_id, telefonos_data):
        try:
            if not cliente_id or not isinstance(cliente_id, int):
                raise ValueError("ID de cliente no válido")
                
            telefonos_existentes = Telefono.query.filter_by(CLIENTE_ID=cliente_id).all()
            
            telefonos_procesados = []
            
            for tel_data in telefonos_data:
                if not tel_data.get('numero'):
                    continue
                    
                telefono_existente = next(
                    (t for t in telefonos_existentes if t.NUMERO == tel_data['numero']), 
                    None
                )
                
                if telefono_existente:
                    if 'tipo' in tel_data:
                        telefono_existente.TIPO = TelefonoTipo[tel_data['tipo']]
                    telefonos_procesados.append(telefono_existente)
                else:
                    nuevo_telefono = Telefono(
                        NUMERO=tel_data['numero'],
                        TIPO=TelefonoTipo[tel_data.get('tipo', 'CELULAR')].value,
                        CLIENTE_ID=cliente_id
                    )
                    db.session.add(nuevo_telefono)
                    telefonos_procesados.append(nuevo_telefono)
            
            telefonos_a_eliminar = [
                t for t in telefonos_existentes 
                if t not in telefonos_procesados
            ]
            
            for tel in telefonos_a_eliminar:
                db.session.delete(tel)
            
            db.session.commit()
            return telefonos_procesados
            
        except ValueError as e:
            raise APIError(str(e), status_code=400)
        except KeyError as e:
            raise APIError(f"Tipo de teléfono no válido: {str(e)}", status_code=400)
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error al actualizar teléfonos del cliente {cliente_id}: {str(e)}")
            raise APIError(
                f"Error al actualizar teléfonos del cliente {cliente_id}",
                status_code=500,
                payload={'details': str(e)}
            )