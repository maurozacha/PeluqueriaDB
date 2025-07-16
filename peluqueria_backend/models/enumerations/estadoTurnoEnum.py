
from enum import Enum

class EstadoTurno(Enum):
    DISPONIBLE = 'DISPONIBLE'
    PENDIENTE = 'PENDIENTE'
    CONFIRMADO = 'CONFIRMADO'
    COMPLETADO = 'COMPLETADO'
    CANCELADO = 'CANCELADO'
    AUSENTE = 'AUSENTE'


    @classmethod
    def get_values(cls):
        return [member.value for member in cls]