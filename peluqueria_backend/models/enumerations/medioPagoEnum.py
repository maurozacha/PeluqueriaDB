from peluqueria_backend.extensions import db

class MetodoPago(db.Model):
    __tablename__ = 'METODO_PAGO'
    __table_args__ = {'extend_existing': True}

    ID = db.Column(db.SmallInteger, primary_key=True)
    NOMBRE = db.Column(db.String(20), unique=True, nullable=False)

    PAGOS = db.relationship('Pago', back_populates='metodo')