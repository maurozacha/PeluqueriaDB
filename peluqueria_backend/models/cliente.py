from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from extensions import db
from persona import Persona

class Cliente(Persona, db.Model):
    __tablename__ = 'clientes'
    
    dni = Column(String(20), unique=True, nullable=False)
    direccion = Column(String(255), nullable=True)

    telefonos = relationship('Telefono', back_populates='cliente', cascade="all, delete-orphan")
    turnos = relationship('Turno', back_populates='cliente')

    def __repr__(self):
        return f'<Cliente {self.nombre_completo()}>'

    def serialize(self):
        persona_data = {
            'id': self.id,
            'nombre': self.nombre,
            'apellido': self.apellido,
            'email': self.email
        }
        cliente_data = {
            'dni': self.dni,
            'direccion': self.direccion,
            'telefonos': [telefono.serialize() for telefono in self.telefonos]
        }
        return {**persona_data, **cliente_data}