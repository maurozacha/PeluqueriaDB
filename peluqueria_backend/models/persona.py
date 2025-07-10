from peluqueria_backend.extensions import db
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Enum
from peluqueria_backend.models.enumerations.tipoPersonaEnum import TipoPersona
from .enumerations import TipoEmpleado
from sqlalchemy.orm import relationship

class Persona(db.Model):
    __tablename__ = 'PERSONA'
    
    ID = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False, unique=True)
    fecha_alta = Column(DateTime)
    usuario_alta = Column(String(100))
    fecha_baja = Column(DateTime)
    usuario_baja = Column(String(100))
    tipo_persona = Column(Enum(TipoPersona))  # Campo discriminador
    
    # Campos para Cliente
    dni = Column(String(20), unique=True, nullable=True)
    direccion = Column(String(255), nullable=True)
    
    # Campos para Empleado
    tipo_empleado = Column(Enum(TipoEmpleado), nullable=True)
    especialidad = Column(String(100), nullable=True)
    activo = Column(Boolean, default=True, nullable=True)
    horario_trabajo = Column(String(100), nullable=True)

    # Relaciones
    usuarios = relationship('Usuario', back_populates='persona')
    telefonos = relationship('Telefono', back_populates='cliente')
    
    # Relaciones para turnos (usando viewonly para evitar conflictos)
    turnos_como_cliente = relationship(
        'Turno', 
        foreign_keys='[Turno.CLIENTE_ID]', 
        back_populates='cliente',
        viewonly=True
    )
    turnos_como_empleado = relationship(
        'Turno', 
        foreign_keys='[Turno.EMPLEADO_ID]', 
        back_populates='empleado',
        viewonly=True
    )

    __mapper_args__ = {
        'polymorphic_on': tipo_persona,
        'polymorphic_identity': 'PERSONA',
        'with_polymorphic': '*'
    }

    def serialize(self):
        base_data = {
            'id': self.ID,
            'tipo_persona': self.tipo_persona.value if hasattr(self.tipo_persona, 'value') else self.tipo_persona,
            'nombre': self.nombre,
            'apellido': self.apellido,
            'email': self.email,
            'fecha_alta': self.fecha_alta.isoformat() if self.fecha_alta else None,
            'usuario_alta': self.usuario_alta,
            'fecha_baja': self.fecha_baja.isoformat() if self.fecha_baja else None,
            'usuario_baja': self.usuario_baja
        }

        if self.tipo_persona == TipoPersona.CLIENTE:
            base_data.update({
                'dni': self.dni,
                'direccion': self.direccion,
                'telefonos': [t.serialize() for t in self.telefonos]
            })
        elif self.tipo_persona == TipoPersona.EMPLEADO:
            base_data.update({
                'tipo_empleado': self.tipo_empleado.name if self.tipo_empleado else None,
                'especialidad': self.especialidad,
                'activo': self.activo,
                'horario_trabajo': self.horario_trabajo
            })

        return base_data