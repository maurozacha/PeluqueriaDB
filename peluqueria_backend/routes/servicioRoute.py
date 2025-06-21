from flask import Blueprint, request, jsonify
from ..auth.decorators import token_required, admin_required
from peluqueria_backend.services.servicioService import ServicioService

servicios_blueprint = Blueprint('servicios', __name__, url_prefix='/api/servicios')

@servicios_blueprint.route('/', methods=['GET'])
def get_servicios():
    servicios = ServicioService.get_servicios()
    return jsonify([s.serialize() for s in servicios])

@servicios_blueprint.route('/', methods=['POST'])
@token_required
@admin_required
def crear_servicio():
    data = request.get_json()
    try:
        servicio = ServicioService.crear_servicio(
            nombre=data['nombre'],
            descripcion=data.get('descripcion'),
            precio=data['precio']
        )
        return jsonify(servicio.serialize()), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 400