from enum import Enum

class TipoServicio(str, Enum):
    CORTE = 'CORTE'
    TINTURA = 'TINTURA'
    BARBERIA = 'BARBERIA'

    @classmethod
    def get_values(cls):
        return [member.value for member in cls]