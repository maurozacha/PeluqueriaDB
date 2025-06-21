from sqlalchemy import Column, String, Boolean, Enum, DateTime
from sqlalchemy.orm import relationship
from extensions import db
from persona import Persona
from enumerations import TipoEmpleado

class Empleado(Persona, db.Model):
    __tablename__ = 'EMPLEADO'
    
    TIPO = Column('TIPO', Enum(TipoEmpleado), nullable=False, default=TipoEmpleado.PELUQUERO)
    ESPECIALIDAD = Column('ESPECIALIDAD', String(100), nullable=True)
    ACTIVO = Column('ACTIVO', Boolean, default=True)
    HORARIO_TRABAJO = Column('HORARIO_TRABAJO', String(100), nullable=True) 

    RESERVAS = relationship('Reserva', back_populates='EMPLEADO')

    def __repr__(self):
        return f'<Empleado {self.nombre_completo()} ({self.TIPO.name})>'

    def serialize(self):
        persona_data = {
            'ID': self.ID,
            'NOMBRE': self.NOMBRE,
            'APELLIDO': self.APELLIDO,
            'EMAIL': self.EMAIL,
            'FECHA_ALTA': self.FECHA_ALTA.isoformat() if self.FECHA_ALTA else None,
            'USUARIO_ALTA': self.USUARIO_ALTA,
            'FECHA_BAJA': self.FECHA_BAJA.isoformat() if self.FECHA_BAJA else None,
            'USUARIO_BAJA': self.USUARIO_BAJA
        }
        empleado_data = {
            'TIPO': self.TIPO.name,
            'ESPECIALIDAD': self.ESPECIALIDAD,
            'ACTIVO': self.ACTIVO,
            'HORARIO_TRABAJO': self.HORARIO_TRABAJO,
            'RESERVAS': [reserva.serialize() for reserva in self.RESERVAS]
        }
        return {**persona_data, **empleado_data}