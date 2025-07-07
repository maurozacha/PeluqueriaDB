from models.servicio import Servicio

class ServicioRepository:
    @staticmethod
    def get_by_id(servicio_id):
        return Servicio.query.get(servicio_id)

    @staticmethod
    def get_all():
        return Servicio.query.all()

    @staticmethod
    def get_by_empleado_id(empleado_id):
        return Servicio.query.join(Servicio.RESERVAS).filter_by(EMPLEADO_ID=empleado_id).all()