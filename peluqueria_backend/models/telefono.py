from sqlalchemy import Column, Integer, Enum, String, ForeignKey
from sqlalchemy.orm import relationship
from extensions import db
from enumerations import TelefonoTipo

class Telefono(db.Model):
    __tablename__ = 'telefonos'

    id = Column(Integer, primary_key=True)
    numero = Column(String(15), nullable=False)
    tipo = Column(Enum(TelefonoTipo), nullable=False)
    cliente_id = Column(Integer, ForeignKey('clientes.id'), nullable=False)

    cliente = relationship('Cliente', back_populates='telefonos')

    def __repr__(self):
        return f'<Telefono {self.numero} ({self.tipo.name})>'

    def serialize(self):
        return {
            'id': self.id,
            'numero': self.numero,
            'tipo': self.tipo.name,
            'cliente_id': self.cliente_id
        }