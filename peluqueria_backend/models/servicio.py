from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
from extensions import db

class Servicio(db.Model):
    __tablename__ = 'SERVICIO'

    ID = Column('ID', Integer, primary_key=True)
    NOMBRE = Column('NOMBRE', String(100), nullable=False)
    DESCRIPCION = Column('DESCRIPCION', String(255), nullable=True)
    PRECIO = Column('PRECIO', Float, nullable=False)
    DURACION_ESTIMADA = Column('DURACION_ESTIMADA', Integer, default=30)  # en minutos
    FECHA_ALTA = Column('FECHA_ALTA', DateTime, default=db.func.current_timestamp())
    USUARIO_ALTA = Column('USUARIO_ALTA', String(100))
    FECHA_BAJA = Column('FECHA_BAJA', DateTime)
    USUARIO_BAJA = Column('USUARIO_BAJA', String(100))

    RESERVAS = relationship('Reserva', back_populates='SERVICIO')

    def __repr__(self):
        return f'<Servicio {self.NOMBRE}>'

    def serialize(self):
        return {
            'ID': self.ID,
            'NOMBRE': self.NOMBRE,
            'DESCRIPCION': self.DESCRIPCION,
            'PRECIO': self.PRECIO,
            'DURACION_ESTIMADA': self.DURACION_ESTIMADA,
            'FECHA_ALTA': self.FECHA_ALTA.isoformat() if self.FECHA_ALTA else None,
            'USUARIO_ALTA': self.USUARIO_ALTA,
            'FECHA_BAJA': self.FECHA_BAJA.isoformat() if self.FECHA_BAJA else None,
            'USUARIO_BAJA': self.USUARIO_BAJA,
            'RESERVAS': [reserva.serialize() for reserva in self.RESERVAS]
        }