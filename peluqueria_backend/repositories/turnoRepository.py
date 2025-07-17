from peluqueria_backend.models.enumerations.estadoTurnoEnum import EstadoTurno
from peluqueria_backend.models.turno import Turno
from peluqueria_backend.extensions import db
from datetime import datetime

class TurnoRepository:
    @staticmethod
    def get_all():
        return Turno.query.all()

    @staticmethod
    def get_by_id(turno_id):
        return Turno.query.get(turno_id)
    
    @staticmethod
    def get_all_by_cliente_id(cliente_id):
        return Turno.query.filter_by(CLIENTE_ID=cliente_id).all()


    @staticmethod
    def get_by_empleado_fecha(empleado_id, fecha):
        return Turno.query.filter(
            Turno.EMPLEADO_ID == empleado_id,
            Turno.FECHA_HORA >= fecha,
            Turno.ESTADO != EstadoTurno.CANCELADO.value
        ).all()

    @staticmethod
    def create(turno):
        db.session.add(turno)
        db.session.commit()
        return turno

    @staticmethod
    def update(turno):
        db.session.add(turno)
        db.session.commit()
        return turno

    @staticmethod
    def get_disponibles(empleado_id, servicio_id):
        
        return Turno.query.filter(
            Turno.EMPLEADO_ID == empleado_id,
            Turno.SERVICIO_ID == servicio_id,
            Turno.CLIENTE_ID.is_(None),
            Turno.ESTADO == EstadoTurno.DISPONIBLE.value
        ).order_by(Turno.FECHA_HORA).all()