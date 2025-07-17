from peluqueria_backend.models.enumerations.medioPagoEnum import MetodoPago
from peluqueria_backend.extensions import db

class MetodoPagoRepository:
    @staticmethod
    def get_all():
        return db.session.query(MetodoPago).all()
    
    @staticmethod
    def get_by_id(metodo_id):
        return db.session.query(MetodoPago).filter_by(ID=metodo_id).first()