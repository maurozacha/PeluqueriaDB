
from peluqueria_backend.models.enumerations.estadoTurnoEnum import EstadoTurno
from peluqueria_backend.models.turno import Turno
from peluqueria_backend.extensions import db

class TurnoRepository:
    @staticmethod
    def get_all():
        return Turno.query.all()

    @staticmethod
    def get_by_id(turno_id):
        return Turno.query.get(turno_id)

    @staticmethod
    def get_by_empleado_fecha(empleado_id, fecha):
        return Turno.query.filter(
            Turno.empleado_id == empleado_id,
            Turno.fecha_hora >= fecha,
            Turno.estado != EstadoTurno.CANCELADO
        ).all()

    @staticmethod
    def create(turno):
        db.session.add(turno)
        db.session.commit()
        return turno

    @staticmethod
    def update():
        db.session.commit()