from peluqueria_backend.exceptions.exceptions import APIError
from peluqueria_backend.extensions import db
from peluqueria_backend.models.pago import Pago

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

    @staticmethod
    def create(**kwargs):
        try:
            pago = Pago(**kwargs)
            db.session.add(pago)
            db.session.commit()
            db.session.refresh(pago) 
            return pago

        except Exception as e:
            db.session.rollback()
            raise APIError(
                "Error al crear pago",
                status_code=500,
                payload={'details': str(e)}
            )