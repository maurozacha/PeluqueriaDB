from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from extensions import db

class Cliente(db.Model):
    __tablename__ = 'clientes'

    id = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    telefono = Column(String(15), nullable=True)

    turnos = relationship('Turno', back_populates='cliente')

    def __repr__(self):
        return f'<Cliente {self.nombre}>'