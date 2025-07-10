from flask import Blueprint, request, jsonify
from peluqueria_backend.auth.decorators import token_required
from services import ClienteService

cliente_bp = Blueprint('cliente_bp', __name__)

@cliente_bp.route('/clientes', methods=['GET'])
@token_required
def get_clientes():
    clientes = ClienteService.listar_clientes()
    return jsonify([c.serialize() for c in clientes])

@cliente_bp.route('/clientes', methods=['POST'])
@token_required
def crear_cliente():
    data = request.json
    cliente = ClienteService.crear_cliente(data)
    return jsonify(cliente.serialize()), 201