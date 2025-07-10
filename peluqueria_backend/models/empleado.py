from peluqueria_backend.extensions import db
from sqlalchemy.orm import relationship

from peluqueria_backend.models.enumerations.tipoEmpleadoEnum import TipoEmpleado
from peluqueria_backend.models.persona import Persona

class Empleado(Persona):
    __mapper_args__ = {
        'polymorphic_identity': 'EMPLEADO',
        'inherit_condition': (Persona.ID == id)
    }

    # Relaciones específicas de Empleado
    turnos = relationship('Turno', foreign_keys='Turno.EMPLEADO_ID', back_populates='empleado')

    def __init__(self, **kwargs):
        if 'tipo_empleado' in kwargs and isinstance(kwargs['tipo_empleado'], str):
            kwargs['tipo_empleado'] = TipoEmpleado[kwargs['tipo_empleado']]
        super().__init__(**kwargs)
        self.tipo_persona = 'EMPLEADO'

    @property
    def nombre_completo(self):
        return f"{self.nombre} {self.apellido}"

    def __repr__(self):
        return f'<Empleado {self.ID}: {self.nombre_completo} ({self.tipo_empleado.name})>'

    def serialize(self):
        return super().serialize()

    @classmethod
    def get_by_id(cls, id):
        return cls.query.filter_by(ID=id).first()

    @classmethod
    def get_activos(cls):
        return cls.query.filter_by(activo=True).all()