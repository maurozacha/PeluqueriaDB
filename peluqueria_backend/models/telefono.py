from sqlalchemy import Column, DateTime, Integer, Enum, String, ForeignKey
from sqlalchemy.orm import relationship
from peluqueria_backend.extensions import db
from peluqueria_backend.models.enumerations.tipoTelefonoEnum import TelefonoTipo

class Telefono(db.Model):
    __tablename__ = 'TELEFONO'

    ID = Column('ID', Integer, primary_key=True)
    NUMERO = Column('NUMERO', String(15), nullable=False)
    TIPO = Column('TIPO', Enum(TelefonoTipo), nullable=False)
    CLIENTE_ID = Column('CLIENTE_ID', Integer, ForeignKey('PERSONA.ID'), nullable=False)

    # Relación con Cliente (corregida)
    cliente = relationship('Cliente', back_populates='telefonos')

    def __repr__(self):
        return f'<Telefono {self.NUMERO} ({self.TIPO.name})>'

    def serialize(self):
        return {
            'id': self.ID,
            'numero': self.NUMERO,
            'tipo': self.TIPO.name,
            'cliente_id': self.CLIENTE_ID
        }