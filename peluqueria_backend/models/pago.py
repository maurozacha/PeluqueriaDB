from peluqueria_backend.extensions import db

class Pago(db.Model):
    __tablename__ = 'PAGO'

    ID = db.Column(db.Integer, primary_key=True)
    MONTO = db.Column(db.Numeric(10, 2), nullable=False)
    FECHA_PAGO = db.Column(db.DateTime)
    COMPROBANTE = db.Column(db.String(50), nullable=True)
    DATOS_PAGO = db.Column(db.String(500))
    FECHA_ALTA = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    USUARIO_ALTA = db.Column(db.String(100))
    FECHA_BAJA = db.Column(db.DateTime)
    USUARIO_BAJA = db.Column(db.String(100))
    METODO_ID = db.Column(db.SmallInteger, db.ForeignKey('METODO_PAGO.ID'), nullable=False)
    ESTADO_ID = db.Column(db.SmallInteger, db.ForeignKey('ESTADO_PAGO.ID'), nullable=False)
    
    turnos = db.relationship('Turno', back_populates='pago', uselist=False)
    
    metodo = db.relationship('MetodoPago', back_populates='PAGOS')
    estado = db.relationship('EstadoPago', back_populates='PAGOS')

    def __repr__(self):
        return f'<Pago {self.ID} - {self.MONTO}>'

    def serialize(self):
        return {
            'ID': self.ID,
            'MONTO': float(self.MONTO) if self.MONTO is not None else None,
            'FECHA_PAGO': self.FECHA_PAGO.isoformat() if self.FECHA_PAGO else None,
            'COMPROBANTE': self.COMPROBANTE,
            'METODO': self.metodo.NOMBRE if self.metodo else None,
            'ESTADO': self.estado.NOMBRE if self.estado else None,
            'DATOS_PAGO': self.DATOS_PAGO,
            'FECHA_ALTA': self.FECHA_ALTA.isoformat() if self.FECHA_ALTA else None,
            'USUARIO_ALTA': self.USUARIO_ALTA,
            'FECHA_BAJA': self.FECHA_BAJA.isoformat() if self.FECHA_BAJA else None,
            'USUARIO_BAJA': self.USUARIO_BAJA,
            'turno_id': self.turnos.ID if self.turnos else None
        }