from sqlalchemy import Column, Integer, Float, String, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from extensions import db
from .enumerations import estadoPagoEnum, medioPagoEnum

class Pago(db.Model):
    __tablename__ = 'PAGO'
    
    ID = Column('ID', Integer, primary_key=True)
    RESERVA_ID = Column('RESERVA_ID', Integer, ForeignKey('RESERVA.ID'), nullable=False)
    MONTO = Column('MONTO', Float, nullable=False)
    FECHA_PAGO = Column('FECHA_PAGO', DateTime)
    METODO = Column('METODO', Enum(medioPagoEnum.MetodoPago), nullable=False)
    ESTADO = Column('ESTADO', Enum(estadoPagoEnum.EstadoPago), default=estadoPagoEnum.EstadoPago.PENDIENTE)
    ID_EXTERNO = Column('ID_EXTERNO', String(100))  
    DATOS_PAGO = Column('DATOS_PAGO', String(500))  
    FECHA_ALTA = Column('FECHA_ALTA', DateTime, default=db.func.current_timestamp())
    
    RESERVA = relationship('Reserva', back_populates='PAGOS')
    
    def __repr__(self):
        return f'<Pago {self.ID} - {self.MONTO}>'