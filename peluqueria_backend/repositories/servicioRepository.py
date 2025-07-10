from peluqueria_backend.models.servicio import Servicio
from peluqueria_backend.extensions import db  

class ServicioRepository:
    
    @staticmethod
    def get_by_id(servicio_id):
        return db.session.query(Servicio).get(servicio_id)

    @staticmethod
    def get_all():
        return db.session.query(Servicio).all()

    @staticmethod
    def get_by_empleado_id(empleado_id):
        return db.session.query(Servicio)\
               .join(Servicio.turnos)\
               .filter_by(EMPLEADO_ID=empleado_id)\
               .all()

    @staticmethod
    def create(nombre, descripcion, precio, duracion_estimada):
        nuevo_servicio = Servicio(
            NOMBRE=nombre,
            DESCRIPCION=descripcion,
            PRECIO=precio,
            DURACION_ESTIMADA=duracion_estimada
        )
        db.session.add(nuevo_servicio)
        db.session.commit()
        return nuevo_servicio

    @staticmethod
    def update(servicio_id, **kwargs):
        servicio = Servicio.query.get(servicio_id)
        if servicio:
            for key, value in kwargs.items():
                if hasattr(servicio, key):
                    setattr(servicio, key, value)
            db.session.commit()
        return servicio

    @staticmethod
    def delete(servicio_id):
        servicio = Servicio.query.get(servicio_id)
        if servicio:
            db.session.delete(servicio)
            db.session.commit()
            return True
        return False