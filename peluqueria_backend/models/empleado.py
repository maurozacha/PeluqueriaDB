from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from extensions import db

class Empleado(db.Model):
    __tablename__ = 'empleados'

    id = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=False)
    especialidad = Column(String(100), nullable=True)

    turnos = relationship('Turno', back_populates='empleado')

    def __repr__(self):
        return f'<Empleado {self.nombre}>'

    def serialize(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'especialidad': self.especialidad
        }