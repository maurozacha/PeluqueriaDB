from extensions import db
from sqlalchemy import Column, Integer, ForeignKey, DateTime, String, Enum
from sqlalchemy.orm import relationship
from .enumerations.estadoTurnoEnum import EstadoTurno

class Turno(db.Model):
    __tablename__ = 'turnos'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True)
    fecha_hora = Column(DateTime, nullable=False)
    duracion = Column(Integer, nullable=False, default=30) 
    estado = Column(Enum(EstadoTurno), default=EstadoTurno.PENDIENTE)
    notas = Column(String(255), nullable=True)
    cliente_id = Column(Integer, ForeignKey('clientes.id'), nullable=False)
    empleado_id = Column(Integer, ForeignKey('empleados.id'), nullable=False)
    servicio_id = Column(Integer, ForeignKey('servicios.id'), nullable=False)

    cliente = relationship('Cliente', back_populates='turnos')
    empleado = relationship('Empleado', back_populates='turnos')
    servicio = relationship('Servicio', back_populates='turnos')

    def __repr__(self):
        return f'<Turno {self.fecha_hora} - {self.estado.name}>'

    def serialize(self):
        return {
            'id': self.id,
            'fecha_hora': self.fecha_hora.isoformat() if self.fecha_hora else None,
            'duracion': self.duracion,
            'estado': self.estado.name,
            'notas': self.notas,
            'cliente_id': self.cliente_id,
            'empleado_id': self.empleado_id,
            'servicio_id': self.servicio_id,
            'cliente': self.cliente.serialize() if self.cliente else None,
            'empleado': self.empleado.serialize() if self.empleado else None,
            'servicio': self.servicio.serialize() if self.servicio else None
        }