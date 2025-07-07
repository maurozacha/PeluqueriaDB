from models.pago import Pago
from extensions import db

class PagoRepository:
    @staticmethod
    def get_by_id(pago_id):
        return Pago.query.get(pago_id)

    @staticmethod
    def create(pago):
        db.session.add(pago)
        db.session.commit()
        return pago

    @staticmethod
    def update():
        db.session.commit()