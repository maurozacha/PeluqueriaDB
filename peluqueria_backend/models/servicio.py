from sqlalchemy import Column, Integer, String, Float, DateTime, Enum as SQLEnum
from sqlalchemy.orm import relationship
from peluqueria_backend.extensions import db
from .enumerations.tipoServicioEnum import TipoServicio

class Servicio(db.Model):
    __tablename__ = 'SERVICIO'

    ID = Column('ID', Integer, primary_key=True)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(String(255), nullable=True)
    precio = Column(Float, nullable=False)
    duracion_estimada = Column(Integer, default=30)  
    fecha_alta = Column(DateTime, default=db.func.current_timestamp())
    tipo_servicio = Column(
        SQLEnum(*TipoServicio.get_values(), name='tipo_servicio_enum'),
        nullable=False,
        default=TipoServicio.CORTE.value
    )
    usuario_alta = Column(String(100))
    fecha_baja = Column(DateTime)
    usuario_baja = Column(String(100))

    turnos = relationship('Turno', back_populates='servicio')

    servicio_empleado_rel = relationship(
        'ServicioEmpleado', 
        back_populates='servicio',
        cascade='all, delete-orphan'
    )

    empleados = relationship(
        'Empleado',
        secondary='SERVICIO_EMPLEADO',
        back_populates='servicios',
        viewonly=True
    )

    def __repr__(self):
        return f'<Servicio {self.ID}: {self.nombre}>'

    def serialize(self, include_empleados=False):
        data = {
            'ID': self.ID,
            'nombre': self.nombre,
            'descripcion': self.descripcion,
            'precio': self.precio,
            'duracion_estimada': self.duracion_estimada,
            'fecha_alta': self.fecha_alta.isoformat() if self.fecha_alta else None,
            'usuario_alta': self.usuario_alta,
            'tipo_servicio': self.tipo_servicio,
            'fecha_baja': self.fecha_baja.isoformat() if self.fecha_baja else None,
            'usuario_baja': self.usuario_baja
        }

        if include_empleados:
            data['empleados'] = [empleado.serialize() for empleado in self.empleados]

        return data