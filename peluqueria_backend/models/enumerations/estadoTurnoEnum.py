from enum import Enum as PyEnum

class EstadoTurno(PyEnum):
    PENDIENTE = 1
    CONFIRMADO = 2
    COMPLETADO = 3
    CANCELADO = 4
    AUSENTE = 5