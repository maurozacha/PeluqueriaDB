from peluqueria_backend.extensions import db

class EstadoPago(db.Model):
    __tablename__ = 'ESTADO_PAGO'
    __table_args__ = {'extend_existing': True} 
    
    ID = db.Column(db.SmallInteger, primary_key=True)
    NOMBRE = db.Column(db.String(50), unique=True, nullable=False)

    PAGOS = db.relationship('Pago', back_populates='estado') 
