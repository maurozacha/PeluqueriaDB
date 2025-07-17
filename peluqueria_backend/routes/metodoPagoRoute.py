from flask import Blueprint, jsonify
from peluqueria_backend.extensions import db
from peluqueria_backend.models.enumerations.medioPagoEnum import MetodoPago
from peluqueria_backend.services.metodoPagoService import MetodoPagoService

metodo_pago_bp = Blueprint('metodo_pago_bp', __name__)

@metodo_pago_bp.route('/', methods=['GET'])
def listar_metodos_pago():
    try:
        response = MetodoPagoService.listar_metodos_pago()
        return jsonify(response)
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Error al obtener métodos de pago',
            'error': str(e)
        }), 500
