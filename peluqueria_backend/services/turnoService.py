from datetime import datetime, timedelta
from peluqueria_backend.exceptions.exceptions import APIError
from peluqueria_backend.models.enumerations.estadoTurnoEnum import EstadoTurno
import logging

from peluqueria_backend.repositories.empleadoRepository import EmpleadoRepository
from peluqueria_backend.repositories.servicioRepository import ServicioRepository
from peluqueria_backend.repositories.turnoRepository import TurnoRepository

logger = logging.getLogger(__name__)

class TurnoService:
    @staticmethod
    def crear_turno_reserva(cliente_id: int, empleado_id: int, servicio_id: int, 
                          fecha_hora: datetime, notas: str = None) -> dict:
        try:
            empleado = EmpleadoRepository.get_by_id(empleado_id)
            if not empleado or not empleado.activo:
                raise APIError("Empleado no disponible", status_code=400)
            
            servicio = ServicioRepository.get_by_id(servicio_id)
            if not servicio:
                raise APIError("Servicio no encontrado", status_code=404)
            
            duracion = servicio.duracion_estimada or 30
            
            if TurnoService._turno_solapado(empleado_id, fecha_hora, duracion):
                raise APIError("Horario no disponible", status_code=409)
            
            turno_data = {
                'CLIENTE_ID': cliente_id,
                'EMPLEADO_ID': empleado_id,
                'SERVICIO_ID': servicio_id,
                'FECHA_HORA': fecha_hora,
                'DURACION': duracion,
                'NOTAS': notas,
                'ESTADO': EstadoTurno.PENDIENTE
            }
            
            turno = TurnoRepository.create(**turno_data)
            logger.info(f"Turno {turno.ID} creado para cliente {cliente_id}")
            
            return turno.serialize()
            
        except Exception as e:
            logger.error(f"Error creando turno: {str(e)}")
            raise

    @staticmethod
    def _turno_solapado(empleado_id: int, fecha_hora: datetime, duracion: int) -> bool:
        fin_turno = fecha_hora + timedelta(minutes=duracion)
        turnos = TurnoRepository.get_by_empleado_fecha(empleado_id, fecha_hora.date())
        
        for t in turnos:
            inicio_existente = t.FECHA_HORA
            fin_existente = inicio_existente + timedelta(minutes=t.DURACION)
            
            if (fecha_hora < fin_existente) and (fin_turno > inicio_existente):
                return True
                
        return False

    @staticmethod
    def obtener_disponibilidad(empleado_id: int, fecha: datetime.date) -> list:
        try:
            hora_inicio = datetime.strptime("09:00", "%H:%M").time()
            hora_fin = datetime.strptime("18:00", "%H:%M").time()
            
            turnos = TurnoRepository.get_by_empleado_fecha(empleado_id, fecha)
            
            disponibles = []
            slot_actual = datetime.combine(fecha, hora_inicio)
            fin_jornada = datetime.combine(fecha, hora_fin)
            
            while slot_actual < fin_jornada:
                slot_fin = slot_actual + timedelta(minutes=30)
                
                if not TurnoService._slot_ocupado(slot_actual, slot_fin, turnos):
                    disponibles.append(slot_actual.strftime('%Y-%m-%d %H:%M'))
                
                slot_actual = slot_fin
                
            return disponibles
            
        except Exception as e:
            logger.error(f"Error obteniendo disponibilidad: {str(e)}")
            raise

    @staticmethod
    def _slot_ocupado(inicio: datetime, fin: datetime, turnos: list) -> bool:
        for t in turnos:
            inicio_turno = t.FECHA_HORA
            fin_turno = inicio_turno + timedelta(minutes=t.DURACION)
            
            if (inicio < fin_turno) and (fin > inicio_turno):
                return True
        return False

    @staticmethod
    def obtener_turno_por_id(turno_id: int):
        """Obtiene un turno específico por su ID"""
        try:
            logger.debug(f"Buscando turno con ID: {turno_id}")
            turno = TurnoRepository.get_by_id(turno_id)

            if not turno:
                logger.warning(f"Turno con ID {turno_id} no encontrado")
                raise APIError("Turno no encontrado", status_code=404)

            logger.info(f"Turno encontrado: {turno.ID}")
            return turno

        except Exception as e:
            logger.error(f"Error al obtener turno {turno_id}: {str(e)}", exc_info=True)
            raise APIError(
                "Error al obtener turno",
                status_code=500,
                payload={'turno_id': turno_id, 'error': str(e)}
            )

    @staticmethod
    def listar_turnos(cliente_id=None, empleado_id=None, estado=None, fecha=None):
        """Lista turnos con filtros opcionales"""
        try:
            logger.debug("Listando turnos con filtros")
            turnos = TurnoRepository.get_all()

            if cliente_id:
                turnos = [t for t in turnos if t.CLIENTE_ID == cliente_id]
            if empleado_id:
                turnos = [t for t in turnos if t.EMPLEADO_ID == empleado_id]
            if estado:
                turnos = [t for t in turnos if t.ESTADO == estado]
            if fecha:
                fecha_filtro = datetime.strptime(fecha, '%Y-%m-%d').date()
                turnos = [t for t in turnos if t.FECHA_HORA.date() == fecha_filtro]

            logger.info(f"Retornando {len(turnos)} turnos filtrados")
            return turnos

        except Exception as e:
            logger.error(f"Error al listar turnos: {str(e)}", exc_info=True)
            raise APIError(
                "Error al listar turnos",
                status_code=500,
                payload={'error': str(e)}
            )

    @staticmethod
    def confirmar_turno(turno_id: int):
        """Confirma un turno existente"""
        try:
            logger.debug(f"Confirmando turno con ID: {turno_id}")
            turno = TurnoService.obtener_turno_por_id(turno_id)

            turno.ESTADO = EstadoTurno.CONFIRMADO
            TurnoRepository.update(turno)

            logger.info(f"Turno {turno_id} confirmado exitosamente")
            return turno

        except Exception as e:
            logger.error(f"Error al confirmar turno {turno_id}: {str(e)}", exc_info=True)
            raise APIError(
                "Error al confirmar turno",
                status_code=500,
                payload={'turno_id': turno_id, 'error': str(e)}
            )

    @staticmethod
    def cancelar_turno(turno_id: int):
        """Cancela un turno existente"""
        try:
            logger.debug(f"Cancelando turno con ID: {turno_id}")
            turno = TurnoService.obtener_turno_por_id(turno_id)

            turno.ESTADO = EstadoTurno.CANCELADO
            TurnoRepository.update(turno)

            logger.info(f"Turno {turno_id} cancelado exitosamente")
            return turno

        except Exception as e:
            logger.error(f"Error al cancelar turno {turno_id}: {str(e)}", exc_info=True)
            raise APIError(
                "Error al cancelar turno",
                status_code=500,
                payload={'turno_id': turno_id, 'error': str(e)}
            )

    @staticmethod
    def completar_turno(turno_id: int):
        """Marca un turno como completado"""
        try:
            logger.debug(f"Completando turno con ID: {turno_id}")
            turno = TurnoService.obtener_turno_por_id(turno_id)

            turno.ESTADO = EstadoTurno.COMPLETADO
            TurnoRepository.update(turno)

            logger.info(f"Turno {turno_id} marcado como completado")
            return turno

        except Exception as e:
            logger.error(f"Error al completar turno {turno_id}: {str(e)}", exc_info=True)
            raise APIError(
                "Error al completar turno",
                status_code=500,
                payload={'turno_id': turno_id, 'error': str(e)}
            )