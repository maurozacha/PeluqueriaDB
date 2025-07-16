from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from peluqueria_backend.extensions import db

class ServicioEmpleado(db.Model):
    __tablename__ = 'SERVICIO_EMPLEADO'

    SERVICIO_ID = Column(Integer, ForeignKey('SERVICIO.ID'), primary_key=True, nullable=False)
    EMPLEADO_ID = Column(Integer, ForeignKey('PERSONA.ID'), primary_key=True, nullable=False)

    servicio = relationship("Servicio", back_populates="servicio_empleado_rel")
    empleado = relationship("Empleado", back_populates="servicio_empleado_rel")

    def serialize(self, include_details=False):
      data = {
          "servicio_id": self.SERVICIO_ID,
          "empleado_id": self.EMPLEADO_ID
      }
      if include_details:
          data.update({
              "servicio": self.servicio.serialize() if self.servicio else None,
              "empleado": self.empleado.serialize() if self.empleado else None
          })
      return data