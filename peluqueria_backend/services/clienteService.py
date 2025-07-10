

from peluqueria_backend.models.cliente import Cliente
from peluqueria_backend.repositories.clienteRepository import ClienteRepository


class ClienteService:
    @staticmethod
    def listar_clientes():
        return ClienteRepository.get_all()

    @staticmethod
    def crear_cliente(data):
        cliente = Cliente(**data)
        return ClienteRepository.create(cliente)
    
    @staticmethod
    def obtener_cliente_por_id(cliente_id):
        return ClienteRepository.get_by_id(cliente_id)