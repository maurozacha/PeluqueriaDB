from enum import Enum

class TipoPersona(str, Enum):
    CLIENTE = 'CLIENTE'
    EMPLEADO = 'EMPLEADO'
    ADMINISTRADOR = 'ADMINISTRADOR'
    
    def __str__(self):
        return self.value