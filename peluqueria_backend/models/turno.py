from peluqueria_backend.extensions import db
from sqlalchemy import Column, Integer, ForeignKey, DateTime, String, Enum, Text
from sqlalchemy.orm import relationship
from peluqueria_backend.models.enumerations.estadoTurnoEnum import EstadoTurno

class Turno(db.Model):
    __tablename__ = 'TURNO'

    ID = Column(Integer, primary_key=True)
    FECHA_HORA = Column(DateTime, nullable=False)
    DURACION = Column(Integer, nullable=False, default=30)
    ESTADO = Column(Enum(EstadoTurno), default=EstadoTurno.PENDIENTE, nullable=False)
    NOTAS = Column(Text, nullable=True)
    CLIENTE_ID = Column(Integer, ForeignKey('PERSONA.ID'), nullable=False)
    EMPLEADO_ID = Column(Integer, ForeignKey('PERSONA.ID'), nullable=False)
    SERVICIO_ID = Column(Integer, ForeignKey('SERVICIO.ID'), nullable=False)
    PAGO_ID = Column(Integer, ForeignKey('PAGO.ID'), nullable=True)
    FECHA_ALTA = Column(DateTime, default=db.func.current_timestamp())
    USUARIO_ALTA = Column(String(100))
    FECHA_BAJA = Column(DateTime)
    USUARIO_BAJA = Column(String(100))

    cliente = relationship('Cliente', foreign_keys=[CLIENTE_ID], back_populates='turnos')
    empleado = relationship('Empleado', foreign_keys=[EMPLEADO_ID], back_populates='turnos')
    servicio = relationship('Servicio', back_populates='turnos')
    pago = relationship('Pago', back_populates='turnos', foreign_keys=[PAGO_ID])

    def __repr__(self):
        return f'<Turno {self.ID}: {self.FECHA_HORA} - {self.ESTADO.name}>'

    def serialize(self):
        return {
            'id': self.ID,
            'fecha_hora': self.FECHA_HORA.isoformat() if self.FECHA_HORA else None,
            'duracion': self.DURACION,
            'estado': self.ESTADO.name,
            'notas': self.NOTAS,
            'cliente_id': self.CLIENTE_ID,
            'empleado_id': self.EMPLEADO_ID,
            'servicio_id': self.SERVICIO_ID,
            'pago_id': self.PAGO_ID,
            'fecha_alta': self.FECHA_ALTA.isoformat() if self.FECHA_ALTA else None,
            'usuario_alta': self.USUARIO_ALTA,
            'fecha_baja': self.FECHA_BAJA.isoformat() if self.FECHA_BAJA else None,
            'usuario_baja': self.USUARIO_BAJA,
            'cliente': self.cliente.serialize() if self.cliente else None,
            'empleado': self.empleado.serialize() if self.empleado else None,
            'servicio': self.servicio.serialize() if self.servicio else None,
            'pago': self.pago.serialize() if self.pago else None
        }