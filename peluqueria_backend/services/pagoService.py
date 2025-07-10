from datetime import datetime

from peluqueria_backend.models.enumerations.estadoPagoEnum import EstadoPago
from peluqueria_backend.models.pago import Pago
from peluqueria_backend.repositories.pagoRepository import PagoRepository

class PagoService:
    @staticmethod
    def obtener_pago_por_id(pago_id):
        return PagoRepository.get_by_id(pago_id)

    @staticmethod
    def crear_pago(reserva_id, monto, metodo, datos_pago=None):
        pago = Pago(
            RESERVA_ID=reserva_id,
            MONTO=monto,
            FECHA_PAGO=datetime.now(),
            METODO=metodo,
            ESTADO=EstadoPago.PENDIENTE,
            DATOS_PAGO=datos_pago
        )
        return PagoRepository.create(pago)

    @staticmethod
    def cancelar_pago(pago_id):
        pago = PagoRepository.get_by_id(pago_id)
        if pago:
            pago.ESTADO = EstadoPago.CANCELADO
            PagoRepository.update()
        return pago