from sqlalchemy import Column, DateTime, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from peluqueria_backend.extensions import db

class Usuario(db.Model):
    __tablename__ = 'USUARIO'
    
    usuario = Column(String(50), primary_key=True) 
    contrasena = Column(String(255), nullable=False) 
    activo = Column(Boolean, default=True) 
    rol = Column(String(20), nullable=False) 
    persona_id = Column('PERSONA_ID', Integer, ForeignKey('PERSONA.ID'), nullable=False)
    fecha_alta = Column(DateTime, default=db.func.current_timestamp()) 
    usuario_alta = Column(String(50)) 
    fecha_baja = Column(DateTime) 
    usuario_baja = Column(String(50)) 

    persona = relationship("Persona", back_populates="usuarios") 

    def __repr__(self):
        return f'<Usuario {self.usuario}>'

    def serialize(self):
        return {
            'usuario': self.usuario,
            'rol': self.rol,
            'activo': self.activo,
            'persona_id': self.persona_id,
            'fecha_alta': self.fecha_alta.isoformat() if self.fecha_alta else None,
            'persona': self.persona.serialize() if self.persona else None
        }