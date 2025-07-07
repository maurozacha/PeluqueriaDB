from repositories.reservaRepository import ReservaRepository
from services.clienteService import ClienteService
from services.empleadoService import EmpleadoService
from services.servicioService import ServicioService
from services.pagoService import PagoService
from models.reserva import Reserva
from models.enumerations.estadoTurnoEnum import EstadoTurno
from datetime import datetime

class ReservaService:
    @staticmethod
    def crear_reserva(data):
        ClienteService.obtener_cliente_por_id(data['CLIENTE_ID'])
        EmpleadoService.obtener_empleado_por_id(data['EMPLEADO_ID'])
        servicio = ServicioService.obtener_servicio_por_id(data['SERVICIO_ID'])
        reserva = Reserva(
            FECHA_HORA=datetime.fromisoformat(data['FECHA_HORA']),
            CLIENTE_ID=data['CLIENTE_ID'],
            EMPLEADO_ID=data['EMPLEADO_ID'],
            SERVICIO_ID=data['SERVICIO_ID'],
            DURACION=data.get('DURACION', servicio.DURACION_ESTIMADA if servicio else 30),
            ESTADO=EstadoTurno.PENDIENTE,
            NOTAS=data.get('NOTAS')
        )
        reserva = ReservaRepository.create(reserva)
        metodo_pago = data.get('METODO_PAGO')
        PagoService.crear_pago(reserva_id=reserva.ID, monto=servicio.PRECIO, metodo=metodo_pago)
        return reserva

    @staticmethod
    def cancelar_reserva(reserva_id):
        reserva = ReservaRepository.get_by_id(reserva_id)
        if not reserva:
            return None
        reserva.ESTADO = EstadoTurno.CANCELADO
        ReservaRepository.update()
        for pago in reserva.PAGOS:
            PagoService.cancelar_pago(pago.ID)
        return reserva

    @staticmethod
    def obtener_reserva_por_id(reserva_id):
        return ReservaRepository.get_by_id(reserva_id)

    @staticmethod
    def listar_reservas():
        return ReservaRepository.get_all()

    @staticmethod
    def modificar_reserva(reserva_id, data):
        reserva = ReservaRepository.get_by_id(reserva_id)
        if not reserva:
            return None
        for key, value in data.items():
            setattr(reserva, key, value)
        ReservaRepository.update()
        return reserva