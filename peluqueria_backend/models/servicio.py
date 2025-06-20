from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship
from extensions import db

class Servicio(db.Model):
    __tablename__ = 'servicios'

    id = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(String(255), nullable=True)
    precio = Column(Float, nullable=False)

    turnos = relationship('Turno', back_populates='servicio')

    def __repr__(self):
        return f'<Servicio {self.nombre}>'

    def serialize(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'descripcion': self.descripcion,
            'precio': self.precio
        }