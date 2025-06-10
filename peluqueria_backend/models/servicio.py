from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from app import db

class Servicio(db.Model):
    __tablename__ = 'servicios'

    id = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(String(255), nullable=True)
    precio = Column(Float, nullable=False)

    turnos = relationship('Turno', back_populates='servicio')

    def __repr__(self):
        return f'<Servicio {self.nombre}>'