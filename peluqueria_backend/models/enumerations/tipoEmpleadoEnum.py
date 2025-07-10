from enum import Enum

class TipoEmpleado(str, Enum):
    PELUQUERO = "PELUQUERO"
    ESTETICISTA = "ESTETICISTA"
    ADMINISTRADOR = "ADMINISTRADOR"
    
    def __str__(self):
        return self.value