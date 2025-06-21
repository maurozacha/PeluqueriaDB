from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship

Base = declarative_base()

class Persona(Base):
    __tablename__ = 'PERSONA'
    
    ID = Column('ID', Integer, primary_key=True)
    NOMBRE = Column('NOMBRE', String(100), nullable=False)
    APELLIDO = Column('APELLIDO', String(100), nullable=False)
    EMAIL = Column('EMAIL', String(100), nullable=False, unique=True)
    FECHA_ALTA = Column('FECHA_ALTA', DateTime)
    USUARIO_ALTA = Column('USUARIO_ALTA', String(100))
    FECHA_BAJA = Column('FECHA_BAJA', DateTime)
    USUARIO_BAJA = Column('USUARIO_BAJA', String(100))
    
    USUARIOS = relationship('Usuario', back_populates='PERSONA')
    
    def nombre_completo(self):
        return f"{self.NOMBRE} {self.APELLIDO}"
    
    def __repr__(self):
        return f'<Persona {self.NOMBRE} {self.APELLIDO}>'