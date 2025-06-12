from models.cliente import Cliente
from extensions import db

class ClienteRepository:
    @staticmethod
    def get_all():
        return Cliente.query.all()

    @staticmethod
    def get_by_id(cliente_id):
        return Cliente.query.get(cliente_id)

    @staticmethod
    def create(cliente):
        db.session.add(cliente)
        db.session.commit()
        return cliente