from extensions import db
from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship

class Turno(db.Model):
    __tablename__ = 'turnos'

    id = Column(Integer, primary_key=True)
    fecha_hora = Column(DateTime, nullable=False)
    cliente_id = Column(Integer, ForeignKey('clientes.id'), nullable=False)
    empleado_id = Column(Integer, ForeignKey('empleados.id'), nullable=False)
    servicio_id = Column(Integer, ForeignKey('servicios.id'), nullable=False)

    cliente = relationship('Cliente', back_populates='turnos')
    empleado = relationship('Empleado', back_populates='turnos')
    servicio = relationship('Servicio', back_populates='turnos')

    def __repr__(self):
        return f'<Turno {self.fecha_hora}>'

    def serialize(self):
        return {
            'id': self.id,
            'fecha_hora': self.fecha_hora.isoformat() if self.fecha_hora else None,
            'cliente_id': self.cliente_id,
            'empleado_id': self.empleado_id,
            'servicio_id': self.servicio_id
        }