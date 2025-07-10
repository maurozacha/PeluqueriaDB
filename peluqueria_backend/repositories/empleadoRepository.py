from peluqueria_backend.extensions import db
from peluqueria_backend.models.empleado import Empleado

class EmpleadoRepository:
    @staticmethod
    def get_all():
        return Empleado.query.all()

    @staticmethod
    def get_by_id(empleado_id):
        return Empleado.query.get(empleado_id)

    @staticmethod
    def create(empleado):
        db.session.add(empleado)
        db.session.commit()
        return empleado

    @staticmethod
    def update(empleado):
        db.session.commit()
        return empleado

    @staticmethod
    def delete(empleado):
        db.session.delete(empleado)
        db.session.commit()