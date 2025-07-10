from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
from peluqueria_backend.extensions import db

class Servicio(db.Model):
    __tablename__ = 'SERVICIO'

    ID = Column('ID', Integer, primary_key=True)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(String(255), nullable=True)
    precio = Column(Float, nullable=False)
    duracion_estimada = Column(Integer, default=30)  # en minutos
    fecha_alta = Column(DateTime, default=db.func.current_timestamp())
    usuario_alta = Column(String(100))
    fecha_baja = Column(DateTime)
    usuario_baja = Column(String(100))

    turnos = relationship('Turno', back_populates='servicio')
    
    def __repr__(self):
        return f'<Servicio {self.ID}: {self.nombre}>'

    def serialize(self):
        return {
            'ID': self.ID,
            'nombre': self.nombre,
            'descripcion': self.descripcion,
            'precio': self.precio,
            'duracion_estimada': self.duracion_estimada,
            'fecha_alta': self.fecha_alta.isoformat() if self.fecha_alta else None,
            'usuario_alta': self.usuario_alta,
            'fecha_baja': self.fecha_baja.isoformat() if self.fecha_baja else None,
            'usuario_baja': self.usuario_baja
        }