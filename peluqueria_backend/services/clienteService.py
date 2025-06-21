from repositories import ClienteRepository
from models.cliente import Cliente

class ClienteService:
    @staticmethod
    def listar_clientes():
        return ClienteRepository.get_all()

    @staticmethod
    def crear_cliente(data):
        cliente = Cliente(**data)
        return ClienteRepository.create(cliente)