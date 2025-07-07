from models.reserva import Reserva
from extensions import db

class ReservaRepository:
    @staticmethod
    def get_all():
        return Reserva.query.all()

    @staticmethod
    def get_by_id(reserva_id):
        return Reserva.query.get(reserva_id)

    @staticmethod
    def create(reserva):
        db.session.add(reserva)
        db.session.commit()
        return reserva

    @staticmethod
    def update():
        db.session.commit()