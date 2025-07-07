from peluqueria_backend.models.empleado import Empleado
from repositories.empleadoRepository import EmpleadoRepository


class EmpleadoService:
    @staticmethod
    def listar_empleados():
        return EmpleadoRepository.get_all()

    @staticmethod
    def crear_empleado(data):
        empleado = Empleado(**data)
        return EmpleadoRepository.create(empleado)

    @staticmethod
    def obtener_empleado_por_id(empleado_id):
        return EmpleadoRepository.get_by_id(empleado_id)

    @staticmethod
    def actualizar_empleado(empleado_id, data):
        empleado = EmpleadoRepository.get_by_id(empleado_id)
        for key, value in data.items():
            setattr(empleado, key, value)
        return EmpleadoRepository.update(empleado)