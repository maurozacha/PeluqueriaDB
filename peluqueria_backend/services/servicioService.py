
from peluqueria_backend.repositories.servicioRepository import ServicioRepository


class ServicioService:
    @staticmethod
    def obtener_servicio_por_id(servicio_id):
        return ServicioRepository.get_by_id(servicio_id)

    @staticmethod
    def listar_servicios():
        return ServicioRepository.get_all()

    @staticmethod
    def listar_servicios_por_empleado(empleado_id):
        return ServicioRepository.get_by_empleado_id(empleado_id)