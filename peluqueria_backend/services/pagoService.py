from datetime import datetime
from peluqueria_backend.exceptions.exceptions import APIError
from peluqueria_backend.models.enumerations.estadoPagoEnum import EstadoPago
from peluqueria_backend.models.enumerations.estadoTurnoEnum import EstadoTurno
from peluqueria_backend.models.pago import Pago
from peluqueria_backend.repositories.pagoRepository import PagoRepository
from peluqueria_backend.repositories.turnoRepository import TurnoRepository
from peluqueria_backend.extensions import db

import logging

logger = logging.getLogger(__name__)

class PagoService:
    @staticmethod
    def obtener_pago_por_id(pago_id: int) -> Pago:
        try:
            logger.debug(f"Buscando pago con ID: {pago_id}")
            pago = PagoRepository.get_by_id(pago_id)
            
            if not pago:
                logger.warning(f"Pago con ID {pago_id} no encontrado")
                raise APIError("Pago no encontrado", status_code=404)
                
            logger.info(f"Pago encontrado: {pago.ID}")
            return pago
            
        except Exception as e:
            logger.error(f"Error al obtener pago {pago_id}: {str(e)}", exc_info=True)
            raise APIError(
                "Error al obtener pago",
                status_code=500,
                payload={'pago_id': pago_id, 'error': str(e)}
            )

    @staticmethod
    def crear_pago(monto: float, metodo_id: int, notas: str = None) -> Pago:
        
        pago_data = {
                'MONTO': monto,
                'FECHA_PAGO': datetime.now(),
                'FECHA_ALTA':datetime.now(),
                'METODO_ID': metodo_id,
                'ESTADO_ID': 1,
                'DATOS_PAGO': notas
            }
        
        try:
            pago = PagoRepository.create(**pago_data)
            logger.info(f"Pago creado exitosamente: {pago.ID}")

            db.session.refresh(pago)
            
            return pago
            
        except Exception as e:
            logger.error(f"Error al crear pago: {str(e)}", exc_info=True)
            raise APIError(
                "Error al crear pago",
                status_code=500,
                payload={'pago_data': pago_data, 'error': str(e)}
            )

    @staticmethod
    def cancelar_pago(pago_id: int) -> Pago:
        try:
            logger.debug(f"Cancelando pago con ID: {pago_id}")
            pago = PagoRepository.get_by_id(pago_id)
            
            if not pago:
                logger.warning(f"Pago con ID {pago_id} no encontrado para cancelación")
                raise APIError("Pago no encontrado", status_code=404)
                
            pago.ESTADO_ID = 5
            PagoRepository.update(pago)
            
            logger.info(f"Pago {pago_id} cancelado exitosamente")
            return pago
            
        except Exception as e:
            logger.error(f"Error al cancelar pago {pago_id}: {str(e)}", exc_info=True)
            raise APIError(
                "Error al cancelar pago",
                status_code=500,
                payload={'pago_id': pago_id, 'error': str(e)}
            )

    @staticmethod
    def pagar_turno(turno_id: int, monto: float, metodo_pago_id: int, notas: str = None) -> Pago:
        try:
            logger.debug(f"Procesando pago para turno {turno_id}")
            
            turno = TurnoRepository.get_by_id(turno_id)
            if not turno:
                logger.warning(f"Turno con ID {turno_id} no encontrado")
                raise APIError("Turno no encontrado", status_code=404)
                
            if turno.ESTADO != EstadoTurno.PENDIENTE:
                logger.warning(f"Turno {turno_id} no está pendiente de pago")
                raise APIError("Turno no está pendiente de pago", status_code=400)
            
            pago = PagoService.crear_pago(
                monto=monto,
                metodo_id=metodo_pago_id,
                notas=notas
            )
            
            if pago is not None:
                turno.ESTADO = EstadoTurno.CONFIRMADO
                turno.PAGO_ID = pago.ID
                TurnoRepository.update(turno)

                db.session.refresh(pago)

                logger.info(f"Pago {pago.ID} procesado exitosamente para turno {turno_id}")
                return pago
            else:
                 raise APIError("Pago no creado", status_code=400)
            
            
        except Exception as e:
            logger.error(f"Error al procesar pago para turno {turno_id}: {str(e)}", exc_info=True)
            raise APIError(
                "Error al procesar pago",
                status_code=500,
                payload={'turno_id': turno_id, 'error': str(e)}
            )