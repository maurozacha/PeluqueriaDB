from repositories.turnoRepository import TurnoRepository
from services.reservaService import ReservaService
from datetime import datetime

class TurnoService:
    @staticmethod
    def listar_turnos():
        return TurnoRepository.get_all()

    @staticmethod
    def obtener_turno_por_id(turno_id):
        return TurnoRepository.get_by_id(turno_id)

    @staticmethod
    def turnos_por_empleado_y_fecha(empleado_id, fecha):
        """
        Devuelve los turnos de un empleado a partir de una fecha dada.
        """
        fecha_dt = datetime.strptime(fecha, '%Y-%m-%d')
        return TurnoRepository.get_by_empleado_fecha(empleado_id, fecha_dt)

    @staticmethod
    def crear_reserva_para_turno(turno_id, datos_reserva):
        """
        Llama a ReservaService para crear una reserva asociada a un turno.
        """
        turno = TurnoRepository.get_by_id(turno_id)
        if not turno:
            return None
        datos_reserva['FECHA_HORA'] = turno.fecha_hora.isoformat()
        datos_reserva['EMPLEADO_ID'] = turno.empleado
        datos_reserva['SERVICIO_ID'] = turno.servicio
        datos_reserva['DURACION'] = turno.duracion
        return ReservaService.crear_reserva(datos_reserva)

    @staticmethod
    def cancelar_reserva_de_turno(reserva_id):
        """
        Llama a ReservaService para cancelar la reserva asociada a un turno.
        """
        return ReservaService.cancelar_reserva(reserva_id)