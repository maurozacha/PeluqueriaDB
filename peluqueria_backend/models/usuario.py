from sqlalchemy import Column, DateTime, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from extensions import db
from models import Persona

class Usuario(db.Model):
    __tablename__ = 'USUARIO'
    
    USUARIO = Column('USUARIO', String(50), primary_key=True)
    CONTRASENA = Column('CONTRASENA', String(255), nullable=False)
    ACTIVO = Column('ACTIVO', Boolean, default=True)
    ROL = Column('ROL', String(20), nullable=False)
    PERSONA_ID = Column('PERSONA_ID', Integer, ForeignKey('PERSONA.ID'), nullable=False)
    FECHA_ALTA = Column('FECHA_ALTA', DateTime, default=db.func.current_timestamp())
    USUARIO_ALTA = Column('USUARIO_ALTA', String(50))
    FECHA_BAJA = Column('FECHA_BAJA', DateTime)
    USUARIO_BAJA = Column('USUARIO_BAJA', String(50))

    PERSONA = relationship('Persona', back_populates='USUARIOS')

    def __repr__(self):
        return f'<Usuario {self.USUARIO}>'

    def serialize(self):
        return {
            'USUARIO': self.USUARIO,
            'ROL': self.ROL,
            'ACTIVO': self.ACTIVO,
            'PERSONA_ID': self.PERSONA_ID,
            'FECHA_ALTA': self.FECHA_ALTA.isoformat() if self.FECHA_ALTA else None,
            'PERSONA': self.PERSONA.serialize() if self.PERSONA else None
        }