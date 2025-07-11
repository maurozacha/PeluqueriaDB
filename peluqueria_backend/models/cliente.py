from peluqueria_backend.extensions import db
from sqlalchemy.orm import relationship

from peluqueria_backend.models.enumerations.tipoPersonaEnum import TipoPersona
from peluqueria_backend.models.persona import Persona

class Cliente(Persona):

    __mapper_args__ = {
        'polymorphic_identity': TipoPersona.CLIENTE.value,
        'inherit_condition': (Persona.ID == id)
    }

    telefonos = relationship('Telefono', back_populates='cliente', cascade="all, delete-orphan")
    turnos = relationship('Turno', foreign_keys='Turno.CLIENTE_ID', back_populates='cliente')

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.tipo_persona = TipoPersona.CLIENTE.value 

    @property
    def nombre_completo(self):
        return f"{self.nombre} {self.apellido}"

    def __repr__(self):
        return f'<Cliente {self.ID}: {self.nombre_completo}>'

    def serialize(self):
        return super().serialize()

    @classmethod
    def get_by_id(cls, id):
        return cls.query.filter_by(ID=id).first()

    @classmethod
    def get_by_dni(cls, dni):
        return cls.query.filter_by(dni=dni).first()