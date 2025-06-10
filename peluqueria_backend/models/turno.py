from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from app import db

class Turno(db.Model):
    __tablename__ = 'turnos'

    id = Column(Integer, primary_key=True)
    fecha_hora = Column(DateTime, nullable=False)
    cliente_id = Column(Integer, ForeignKey('clientes.id'), nullable=False)
    servicio_id = Column(Integer, ForeignKey('servicios.id'), nullable=False)

    cliente = relationship('Cliente', back_populates='turnos')
    servicio = relationship('Servicio', back_populates='turnos')

    def __repr__(self):
        return f'<Turno {self.fecha_hora}>'