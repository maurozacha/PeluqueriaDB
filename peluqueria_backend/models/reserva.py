from sqlalchemy import Column, Integer, DateTime, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from extensions import db
from .enumerations import EstadoTurno

class Reserva(db.Model):
    __tablename__ = 'RESERVA'

    ID = Column('ID', Integer, primary_key=True)
    FECHA_HORA = Column('FECHA_HORA', DateTime, nullable=False)
    DURACION = Column('DURACION', Integer, nullable=False, default=30)
    ESTADO = Column('ESTADO', Enum(EstadoTurno), default=EstadoTurno.PENDIENTE)
    NOTAS = Column('NOTAS', Text)
    CLIENTE_ID = Column('CLIENTE_ID', Integer, ForeignKey('CLIENTE.ID'), nullable=False)
    EMPLEADO_ID = Column('EMPLEADO_ID', Integer, ForeignKey('EMPLEADO.ID'), nullable=False)
    SERVICIO_ID = Column('SERVICIO_ID', Integer, ForeignKey('SERVICIO.ID'), nullable=False)
    FECHA_ALTA = Column('FECHA_ALTA', DateTime, default=db.func.current_timestamp())
    USUARIO_ALTA = Column('USUARIO_ALTA', String(100))
    FECHA_BAJA = Column('FECHA_BAJA', DateTime)
    USUARIO_BAJA = Column('USUARIO_BAJA', String(100))

    CLIENTE = relationship('Cliente', back_populates='RESERVAS')
    EMPLEADO = relationship('Empleado', back_populates='RESERVAS')
    SERVICIO = relationship('Servicio', back_populates='RESERVAS')

    def __repr__(self):
        return f'<Reserva {self.ID} - {self.FECHA_HORA}>'

    def serialize(self):
        return {
            'ID': self.ID,
            'FECHA_HORA': self.FECHA_HORA.isoformat() if self.FECHA_HORA else None,
            'DURACION': self.DURACION,
            'ESTADO': self.ESTADO.name,
            'NOTAS': self.NOTAS,
            'CLIENTE_ID': self.CLIENTE_ID,
            'EMPLEADO_ID': self.EMPLEADO_ID,
            'SERVICIO_ID': self.SERVICIO_ID,
            'FECHA_ALTA': self.FECHA_ALTA.isoformat() if self.FECHA_ALTA else None,
            'USUARIO_ALTA': self.USUARIO_ALTA,
            'FECHA_BAJA': self.FECHA_BAJA.isoformat() if self.FECHA_BAJA else None,
            'USUARIO_BAJA': self.USUARIO_BAJA,
            'CLIENTE': self.CLIENTE.serialize() if self.CLIENTE else None,
            'EMPLEADO': self.EMPLEADO.serialize() if self.EMPLEADO else None,
            'SERVICIO': self.SERVICIO.serialize() if self.SERVICIO else None
        }