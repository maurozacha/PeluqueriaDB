from peluqueria_backend.exceptions.exceptions import APIError
from peluqueria_backend.repositories.metodoPagoRepository import MetodoPagoRepository
import logging

logger = logging.getLogger(__name__)

class MetodoPagoService:
    @staticmethod
    def listar_metodos_pago():
        try:
            metodos = MetodoPagoRepository.get_all()
            return {
                'success': True,
                'data': [{
                    'ID': metodo.ID,
                    'NOMBRE': metodo.NOMBRE
                } for metodo in metodos],
                'count': len(metodos)
            }
        except Exception as e:
            logger.error(f"Error al obtener métodos de pago: {str(e)}", exc_info=True)
            raise APIError(
                "Error al obtener métodos de pago",
                status_code=500,
                payload={'error': str(e)}
            )