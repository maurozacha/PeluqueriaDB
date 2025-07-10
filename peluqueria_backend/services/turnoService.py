from datetime import datetime
from peluqueria_backend.repositories.turnoRepository import TurnoRepository
from peluqueria_backend.models.enumerations.estadoTurnoEnum import EstadoTurno

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
    def crear_turno(datos_turno):
        """
        Crea un nuevo turno (reemplaza la creación de reserva).
        
        Args:
            datos_turno: Diccionario con los datos del turno:
                - cliente_id
                - empleado_id
                - servicio_id
                - fecha_hora
                - duracion (opcional, default=30)
                - notas (opcional)
        """
        # Establecer valores por defecto
        datos_turno.setdefault('duracion', 30)
        datos_turno.setdefault('notas', None)
        datos_turno['estado'] = EstadoTurno.PENDIENTE
        
        return TurnoRepository.create(**datos_turno)

    @staticmethod
    def cancelar_turno(turno_id):
        """
        Cancela un turno cambiando su estado a CANCELADO.
        
        Args:
            turno_id: ID del turno a cancelar
        """
        turno = TurnoRepository.get_by_id(turno_id)
        if not turno:
            return None
            
        turno.estado = EstadoTurno.CANCELADO
        TurnoRepository.update(turno)
        return turno

    @staticmethod
    def confirmar_turno(turno_id):
        """
        Confirma un turno cambiando su estado a CONFIRMADO.
        
        Args:
            turno_id: ID del turno a confirmar
        """
        turno = TurnoRepository.get_by_id(turno_id)
        if not turno:
            return None
            
        turno.estado = EstadoTurno.CONFIRMADO
        TurnoRepository.update(turno)
        return turno

    @staticmethod
    def completar_turno(turno_id):
        """
        Marca un turno como completado cambiando su estado a COMPLETADO.
        
        Args:
            turno_id: ID del turno a completar
        """
        turno = TurnoRepository.get_by_id(turno_id)
        if not turno:
            return None
            
        turno.estado = EstadoTurno.COMPLETADO
        TurnoRepository.update(turno)
        return turno