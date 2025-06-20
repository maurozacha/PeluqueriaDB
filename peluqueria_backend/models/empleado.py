from sqlalchemy import Column, String, Boolean, Enum
from sqlalchemy.orm import relationship
from extensions import db
from persona import Persona
from enumerations import TipoEmpleado

class Empleado(Persona, db.Model):
    __tablename__ = 'empleados'
    
    tipo = Column(Enum(TipoEmpleado), nullable=False, default=TipoEmpleado.PELUQUERO)
    especialidad = Column(String(100), nullable=True)
    activo = Column(Boolean, default=True)
    horario_trabajo = Column(String(100), nullable=True) 

    turnos = relationship('Turno', back_populates='empleado')

    def __repr__(self):
        return f'<Empleado {self.nombre_completo()} ({self.tipo.name})>'

    def serialize(self):
        persona_data = {
            'id': self.id,
            'nombre': self.nombre,
            'apellido': self.apellido,
            'email': self.email
        }
        empleado_data = {
            'tipo': self.tipo.name,
            'tipo_display': TipoEmpleado.get_display_name(self.tipo),
            'especialidad': self.especialidad,
            'activo': self.activo,
            'horario_trabajo': self.horario_trabajo
        }
        return {**persona_data, **empleado_data}