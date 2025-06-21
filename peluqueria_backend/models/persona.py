from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, DateTime

Base = declarative_base()

class Persona(Base):
    __abstract__ = True  
    
    ID = Column('ID', Integer, primary_key=True)
    NOMBRE = Column('NOMBRE', String(100), nullable=False)
    APELLIDO = Column('APELLIDO', String(100), nullable=False)
    EMAIL = Column('EMAIL', String(100), nullable=False)
    FECHA_ALTA = Column('FECHA_ALTA', DateTime)
    USUARIO_ALTA = Column('USUARIO_ALTA', String(100))
    FECHA_BAJA = Column('FECHA_BAJA', DateTime)
    USUARIO_BAJA = Column('USUARIO_BAJA', String(100))
    
    def nombre_completo(self):
        return f"{self.NOMBRE} {self.APELLIDO}"
    
    def __repr__(self):
        return f'<Persona {self.NOMBRE} {self.APELLIDO}>'