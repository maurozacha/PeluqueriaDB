from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import relationship
from extensions import db
from persona import Persona

class Cliente(Persona, db.Model):
    __tablename__ = 'CLIENTE'
    
    DNI = Column('DNI', String(20), unique=True, nullable=False)
    DIRECCION = Column('DIRECCION', String(255), nullable=True)

    TELEFONOS = relationship('Telefono', back_populates='CLIENTE', cascade="all, delete-orphan")
    RESERVAS = relationship('Reserva', back_populates='CLIENTE')

    def __repr__(self):
        return f'<Cliente {self.nombre_completo()}>'

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
        cliente_data = {
            'DNI': self.DNI,
            'DIRECCION': self.DIRECCION,
            'TELEFONOS': [telefono.serialize() for telefono in self.TELEFONOS],
            'RESERVAS': [reserva.serialize() for reserva in self.RESERVAS]
        }
        return {**persona_data, **cliente_data}