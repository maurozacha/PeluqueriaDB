from peluqueria_backend.extensions import db

from .persona import Persona

from .usuario import Usuario
from .cliente import Cliente
from .empleado import Empleado

from .servicio import Servicio
from .turno import Turno
from .pago import Pago
from .telefono import Telefono

from .enumerations.estadoTurnoEnum import EstadoTurno
from .enumerations.tipoEmpleadoEnum import TipoEmpleado
from .enumerations.tipoTelefonoEnum import TelefonoTipo
from .enumerations.estadoPagoEnum import EstadoPago
from .enumerations.medioPagoEnum import MetodoPago

__all__ = [
    "db",
    "Persona", "Usuario", "Cliente", "Empleado",
    "Servicio", "Turno", "Pago", "Telefono",
    "EstadoTurno", "TipoEmpleado", "TelefonoTipo", 
    "EstadoPago", "MetodoPago"
]